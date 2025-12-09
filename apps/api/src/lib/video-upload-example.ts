/**
 * Video Upload and Processing Example
 *
 * This example shows how to upload a video, process it into HLS format,
 * and handle thumbnail selection in the PrepExcellence LMS platform.
 */

import type { Request, Response } from "express";
import prisma from "@/infrastructure/database/connection";
import { videoJobs } from "../lib/queue-processors";
import { asyncHandler } from "../utils/asyncHandler";
import { toPublicUrl, toStoragePath } from "../utils/storageUrl";

/**
 * Example Controller: Upload and Process Video
 *
 * POST /api/videos/upload
 *
 * Flow:
 * 1. Receive video file
 * 2. Create database record
 * 3. Upload raw video to MinIO
 * 4. Enqueue processing job
 * 5. Go service extracts metadata and generates 5 thumbnail options
 * 6. Return video ID to client
 * 7. Client receives callback with thumbnail options
 * 8. User selects thumbnail or uploads custom one
 */
export const uploadVideo = asyncHandler(async (req: Request, res: Response) => {
	const { title, description, courseId } = req.body;
	const videoFile = req.file; // Multer uploaded file

	if (!videoFile) {
		return res.status(400).json({ error: "No video file provided" });
	}

	// Step 1: Create database record
	const video = await prisma.video.create({
		data: {
			title,
			description,
			courseId,
			status: "uploading",
			uploadedBy: req.user.id,
		},
	});

	try {
		// Step 2: Upload raw video to MinIO
		const rawVideoPath = `uploads/${video.id}_raw.mp4`;
		await storageService.uploadFile(videoFile.path, rawVideoPath);

		// Step 3: Update database with raw video path (stored without URL scheme)
		await prisma.video.update({
			where: { id: video.id },
			data: {
				status: "processing",
				rawVideoUrl: rawVideoPath, // Store simple path
			},
		});

		// Step 4: Enqueue processing job
		// Go service will handle S3-compatible storage regardless of provider
		await videoJobs.processVideoHLS(
			video.id,
			rawVideoPath, // Simple path works with MinIO/S3/R2/etc
			`videos/${video.id}`,
			{
				resolutions: ["1080p", "720p", "480p", "360p"],
				thumbnailTimestamp: 5,
				deleteRawAfterProcessing: true,
			},
		);

		// Step 5: Return response
		res.status(202).json({
			message: "Video uploaded and queued for processing",
			videoId: video.id,
			status: "processing",
		});
	} catch (error) {
		// Rollback on error
		await prisma.video.update({
			where: { id: video.id },
			data: { status: "failed", error: error.message },
		});

		throw error;
	}
});

/**
 * Example Controller: Select Thumbnail
 *
 * POST /api/videos/:videoId/thumbnail/select
 * Body: { thumbnailId: "thumb_2" } // Select from generated options
 *
 * This endpoint:
 * 1. Marks selected thumbnail as final
 * 2. Deletes unused thumbnail options from storage
 * 3. Updates database with chosen thumbnail URL
 */
export const selectThumbnail = asyncHandler(
	async (req: Request, res: Response) => {
		const { videoId } = req.params;
		const { thumbnailId } = req.body;

		const video = await prisma.video.findUnique({
			where: { id: videoId },
		});

		if (!video) {
			return res.status(404).json({ error: "Video not found" });
		}

		if (!video.thumbnailOptions || video.thumbnailOptions.length === 0) {
			return res.status(400).json({ error: "No thumbnail options available" });
		}

		// Find selected thumbnail
		const selectedThumbnail = video.thumbnailOptions.find(
			(t: any) => t.id === thumbnailId,
		);

		if (!selectedThumbnail) {
			return res.status(400).json({ error: "Invalid thumbnail ID" });
		}

		// Delete unused thumbnails from storage
		const deletePromises = video.thumbnailOptions
			.filter((t: any) => t.id !== thumbnailId)
			.map((t: any) => {
				const path = toStoragePath(t.url);
				return path
					? storageService
							.deleteFile(path)
							.catch((err) => console.error(`Failed to delete ${path}:`, err))
					: Promise.resolve();
			});
		await Promise.all(deletePromises);

		// Update video with final thumbnail
		await prisma.video.update({
			where: { id: videoId },
			data: {
				thumbnailUrl: selectedThumbnail.url,
				thumbnailOptions: null, // Clear options after selection
			},
		});

		res.json({
			success: true,
			thumbnailUrl: toPublicUrl(selectedThumbnail.url),
		});
	},
);

/**
 * Example Controller: Upload Custom Thumbnail
 *
 * POST /api/videos/:videoId/thumbnail/custom
 * Body: multipart/form-data with thumbnail image file
 *
 * This endpoint:
 * 1. Accepts custom thumbnail upload
 * 2. Deletes all auto-generated thumbnail options
 * 3. Updates database with custom thumbnail URL
 */
export const uploadCustomThumbnail = asyncHandler(
	async (req: Request, res: Response) => {
		const { videoId } = req.params;
		const thumbnailFile = req.file;

		if (!thumbnailFile) {
			return res.status(400).json({ error: "No thumbnail file provided" });
		}

		const video = await prisma.video.findUnique({
			where: { id: videoId },
		});

		if (!video) {
			return res.status(404).json({ error: "Video not found" });
		}

		// Delete all auto-generated thumbnails
		if (video.thumbnailOptions && video.thumbnailOptions.length > 0) {
			const deletePromises = video.thumbnailOptions.map((t: any) => {
				const path = toStoragePath(t.url);
				return path
					? storageService
							.deleteFile(path)
							.catch((err) => console.error(`Failed to delete ${path}:`, err))
					: Promise.resolve();
			});
			await Promise.all(deletePromises);
		}

		// Upload custom thumbnail
		const customThumbnailPath = `videos/${videoId}/thumbnail_custom.jpg`;
		await storageService.uploadFile(thumbnailFile.path, customThumbnailPath);

		// Update video
		await prisma.video.update({
			where: { id: videoId },
			data: {
				thumbnailUrl: customThumbnailPath, // Store simple path
				thumbnailOptions: null,
			},
		});

		res.json({
			success: true,
			thumbnailUrl: toPublicUrl(customThumbnailPath),
		});
	},
);

/**
 * Example Controller: Get Video Status
 *
 * GET /api/videos/:videoId
 */
export const getVideoStatus = asyncHandler(
	async (req: Request, res: Response) => {
		const { videoId } = req.params;

		const video = await prisma.video.findUnique({
			where: { id: videoId },
		});

		if (!video) {
			return res.status(404).json({ error: "Video not found" });
		}

		// Return different response based on status
		const response: any = {
			id: video.id,
			title: video.title,
			status: video.status,
		};

		// Include thumbnail options if available (awaiting selection)
		if (video.thumbnailOptions && video.thumbnailOptions.length > 0) {
			response.thumbnailOptions = video.thumbnailOptions.map((t: any) => ({
				...t,
				url: toPublicUrl(t.url),
			}));
		}

		// Include metadata if extracted
		if (video.duration) {
			response.duration = video.duration;
			response.metadata = {
				width: video.width,
				height: video.height,
				codec: video.codec,
				bitrate: video.bitrate,
				fps: video.fps,
			};
		}

		if (video.status === "ready") {
			response.streamingUrl = toPublicUrl(video.masterPlaylistUrl);
			response.thumbnailUrl = toPublicUrl(video.thumbnailUrl);
		} else if (video.status === "failed") {
			response.error = video.error;
		}

		res.json(response);
	},
);

/**
 * Example: Video Callback Processor (already in queue-processors.ts)
 *
 * This automatically runs when the Go service completes processing
 */
/*
queueService.processJob<VideoProcessingCompleteData>(
  QUEUE_NAMES.VIDEO_CALLBACK,
  JOB_TYPES.VIDEO_PROCESSING_COMPLETE,
  5,
  async (job: Job<VideoProcessingCompleteData>) => {
    logger.info(`Video processing completed for ${job.data.videoId}`);
    
    // Update database
    await prisma.video.update({
      where: { id: job.data.videoId },
      data: {
        status: 'ready',
        masterPlaylistUrl: job.data.masterPlaylistUrl,
        thumbnailUrl: job.data.thumbnailUrl,
        duration: job.data.duration,
        width: job.data.metadata.width,
        height: job.data.metadata.height,
        codec: job.data.metadata.codec,
        bitrate: job.data.metadata.bitrate,
        fps: job.data.metadata.fps,
        processedAt: new Date(job.data.processedAt),
      }
    });

    // Optional: Send notification to user
    await notificationService.sendEmail(
      video.uploadedBy.email,
      'Video Processing Complete',
      `Your video "${video.title}" is ready to watch!`
    );

    logger.info(`Updated video ${job.data.videoId} status to ready`);
  },
);
*/

/**
 * Example Prisma Schema for Video Model
 */
/*
model Video {
  id                  String    @id @default(cuid())
  title               String
  description         String?
  courseId            String
  course              Course    @relation(fields: [courseId], references: [id])
  
  // Upload & Processing
  status              String    @default("uploading") // uploading, processing, ready, failed
  rawVideoUrl         String?
  masterPlaylistUrl   String?
  thumbnailUrl        String?
  
  // Metadata
  duration            Float?
  width               Int?
  height              Int?
  codec               String?
  bitrate             Int?
  fps                 Float?
  
  // Timestamps
  uploadedBy          String
  uploadedAt          DateTime  @default(now())
  processedAt         DateTime?
  error               String?
  
  @@index([courseId])
  @@index([status])
}
*/

/**
 * Example Frontend Usage (React)
 */
/*
import { useState } from 'react';

function VideoUpload() {
  const [uploading, setUploading] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const handleUpload = async (file: File) => {
    setUploading(true);
    
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', 'My Lecture Video');
    formData.append('courseId', 'course-123');

    try {
      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setVideoId(data.videoId);
      setStatus(data.status);

      // Poll for status updates
      pollVideoStatus(data.videoId);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const pollVideoStatus = async (id: string) => {
    const interval = setInterval(async () => {
      const response = await fetch(`/api/videos/${id}`);
      const data = await response.json();
      
      setStatus(data.status);

      if (data.status === 'ready' || data.status === 'failed') {
        clearInterval(interval);
      }
    }, 5000); // Poll every 5 seconds
  };

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        disabled={uploading}
      />
      
      {status === 'processing' && <p>Processing video... This may take a few minutes.</p>}
      {status === 'ready' && <p>Video is ready! <a href={`/videos/${videoId}`}>Watch now</a></p>}
      {status === 'failed' && <p>Processing failed. Please try again.</p>}
    </div>
  );
}
*/

/**
 * Example Video Player Component (React + HLS.js)
 */
/*
import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  videoId: string;
}

function VideoPlayer({ videoId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const response = await fetch(`/api/videos/${videoId}`);
      const data = await response.json();

      if (data.status !== 'ready') {
        return;
      }

      const videoUrl = data.streamingUrl; // https://cdn.prepexcellence.com/videos/123/master.m3u8

      if (videoRef.current) {
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
          });
          
          hls.loadSource(videoUrl);
          hls.attachMedia(videoRef.current);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS manifest loaded, quality levels:', hls.levels);
          });

          return () => hls.destroy();
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          // Native HLS support (Safari)
          videoRef.current.src = videoUrl;
        }
      }
    };

    fetchVideo();
  }, [videoId]);

  return (
    <video
      ref={videoRef}
      controls
      style={{ width: '100%', maxWidth: '1280px' }}
      poster={`https://cdn.prepexcellence.com/videos/${videoId}/thumbnail.jpg`}
    />
  );
}
*/
