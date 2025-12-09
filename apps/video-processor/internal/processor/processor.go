package processor

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	log "github.com/sirupsen/logrus"
	"github.com/trodad-intl/prepexcellence/video-processor/internal/queue"
	"github.com/trodad-intl/prepexcellence/video-processor/internal/storage"
)

const (
	JobTypeProcessVideoHLS = "process-video-hls"
)

// Resolution configurations for HLS
var resolutionConfigs = map[string]ResolutionConfig{
	"1080p": {Height: 1080, Bandwidth: 5000000, VideoBitrate: "5000k", AudioBitrate: "192k"},
	"720p":  {Height: 720, Bandwidth: 2800000, VideoBitrate: "2800k", AudioBitrate: "128k"},
	"480p":  {Height: 480, Bandwidth: 1400000, VideoBitrate: "1400k", AudioBitrate: "128k"},
	"360p":  {Height: 360, Bandwidth: 800000, VideoBitrate: "800k", AudioBitrate: "96k"},
}

type ResolutionConfig struct {
	Height       int
	Bandwidth    int
	VideoBitrate string
	AudioBitrate string
}

type VideoMetadata struct {
	Width   int     `json:"width"`
	Height  int     `json:"height"`
	Codec   string  `json:"codec"`
	Bitrate int     `json:"bitrate"`
	FPS     float64 `json:"fps"`
}

// VideoProcessor handles video processing jobs
type VideoProcessor struct {
	storage       *storage.S3Storage
	callbackQueue *queue.Producer
}

// NewVideoProcessor creates a new video processor
func NewVideoProcessor() *VideoProcessor {
	storageClient, err := storage.NewS3Storage()
	if err != nil {
		log.Fatalf("Failed to initialize storage: %v", err)
	}

	// Initialize callback queue producer
	callbackProducer, err := queue.NewProducer(
		getEnv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/"),
		"video-callback",
	)
	if err != nil {
		log.Fatalf("Failed to initialize callback queue: %v", err)
	}

	return &VideoProcessor{
		storage:       storageClient,
		callbackQueue: callbackProducer,
	}
}

// ProcessJob processes a video job based on its type
func (vp *VideoProcessor) ProcessJob(job *queue.Job) error {
	switch job.JobName {
	case "process-video-hls":
		return vp.processVideoHLS(job)
	default:
		return fmt.Errorf("unknown job type: %s", job.JobName)
	}
}

// processVideoHLS processes a video into HLS format with multiple resolutions
func (vp *VideoProcessor) processVideoHLS(job *queue.Job) error {
	videoID := job.Data["videoId"].(string)
	rawVideoURL := job.Data["rawVideoUrl"].(string)
	outputBasePath := job.Data["outputBasePath"].(string)

	// Parse resolutions (default to all if not specified)
	resolutions := []string{"1080p", "720p", "480p", "360p"}
	if resData, ok := job.Data["resolutions"].([]interface{}); ok {
		resolutions = make([]string, len(resData))
		for i, r := range resData {
			resolutions[i] = r.(string)
		}
	}

	deleteRaw := true
	if dr, ok := job.Data["deleteRawAfterProcessing"].(bool); ok {
		deleteRaw = dr
	}

	log.Infof("Processing video %s to HLS format with resolutions: %v", videoID, resolutions)

	// Download raw video from storage
	localInput := filepath.Join("/tmp", fmt.Sprintf("%s_raw.mp4", videoID))
	if err := vp.storage.DownloadFileFromURL(rawVideoURL, localInput); err != nil {
		vp.sendFailureCallback(videoID, fmt.Sprintf("Failed to download video: %v", err))
		return fmt.Errorf("failed to download video: %w", err)
	}
	defer os.Remove(localInput) // Clean up local file

	// === PHASE 1: Quick metadata extraction and thumbnail generation ===
	// This happens FIRST so the uploader gets immediate feedback
	log.Infof("Phase 1: Extracting metadata and generating thumbnail...")

	// Extract metadata
	metadata, duration, err := vp.extractVideoMetadata(localInput)
	if err != nil {
		vp.sendFailureCallback(videoID, fmt.Sprintf("Failed to extract metadata: %v", err))
		return fmt.Errorf("failed to extract metadata: %w", err)
	}

	log.Infof("Source video metadata: %dx%d (%dp), duration: %.2fs", metadata.Width, metadata.Height, metadata.Height, duration)

	// Generate multiple smart thumbnails for uploader to choose from
	thumbnailOptions, err := vp.generateSmartThumbnails(localInput, videoID, outputBasePath, duration)
	if err != nil {
		log.Warnf("Failed to generate thumbnails: %v", err)
		// Send callback without thumbnails
		vp.sendMetadataCallback(videoID, nil, duration, metadata)
	} else {
		log.Infof("Generated %d thumbnail options", len(thumbnailOptions))
		// Send initial callback with metadata and thumbnail options
		// Uploader can choose one or upload custom
		vp.sendMetadataCallback(videoID, thumbnailOptions, duration, metadata)
	}

	// === PHASE 2: Heavy HLS processing ===
	// Now proceed with the time-consuming transcoding
	log.Infof("Phase 2: Starting HLS transcoding (this may take a while)...")

	// Create local output directory
	localOutputDir := filepath.Join("/tmp", videoID)
	os.MkdirAll(localOutputDir, 0755)
	defer os.RemoveAll(localOutputDir) // Clean up

	// Process each resolution and generate HLS segments
	variantPlaylists := []map[string]interface{}{}
	masterPlaylistLines := []string{"#EXTM3U", "#EXT-X-VERSION:3"}
	processedAnyVariant := false

	for _, resolution := range resolutions {
		config, exists := resolutionConfigs[resolution]
		if !exists {
			log.Warnf("Unknown resolution %s, skipping", resolution)
			continue
		}

		// Skip if video resolution is lower than target (never upscale)
		if metadata.Height < config.Height {
			log.Infof("Skipping %s (source is only %dp, won't upscale)", resolution, metadata.Height)
			continue
		}

		processedAnyVariant = true

		log.Infof("Processing %s variant", resolution)

		// Create HLS variant
		variantDir := filepath.Join(localOutputDir, resolution)
		os.MkdirAll(variantDir, 0755)

		playlistPath := filepath.Join(variantDir, "playlist.m3u8")
		segmentPattern := filepath.Join(variantDir, "segment_%03d.ts")

		// FFmpeg command for HLS generation
		args := []string{
			"-i", localInput,
			"-vf", fmt.Sprintf("scale=-2:%d", config.Height),
			"-c:v", "libx264",
			"-preset", "medium",
			"-b:v", config.VideoBitrate,
			"-maxrate", config.VideoBitrate,
			"-bufsize", fmt.Sprintf("%dk", config.Bandwidth/1000*2),
			"-c:a", "aac",
			"-b:a", config.AudioBitrate,
			"-ac", "2",
			"-ar", "48000",
			"-hls_time", "6", // 6 second segments
			"-hls_playlist_type", "vod",
			"-hls_segment_filename", segmentPattern,
			"-f", "hls",
			playlistPath,
		}

		cmd := exec.Command("ffmpeg", args...)
		output, err := cmd.CombinedOutput()
		if err != nil {
			log.Errorf("FFmpeg error for %s: %s", resolution, string(output))
			continue
		}

		// Upload HLS files to storage
		variantOutputPath := fmt.Sprintf("%s/%s", outputBasePath, resolution)
		if err := vp.uploadDirectory(variantDir, variantOutputPath); err != nil {
			log.Errorf("Failed to upload %s variant: %v", resolution, err)
			continue
		}

		playlistURL := fmt.Sprintf("%s/playlist.m3u8", variantOutputPath)

		// Add to master playlist
		masterPlaylistLines = append(masterPlaylistLines,
			fmt.Sprintf("#EXT-X-STREAM-INF:BANDWIDTH=%d,RESOLUTION=%dx%d",
				config.Bandwidth,
				int(float64(config.Height)*16/9), // Assume 16:9 aspect ratio
				config.Height,
			),
			fmt.Sprintf("%s/playlist.m3u8", resolution),
		)

		variantPlaylists = append(variantPlaylists, map[string]interface{}{
			"resolution":  resolution,
			"playlistUrl": playlistURL,
			"bandwidth":   config.Bandwidth,
		})

		log.Infof("Successfully processed %s variant", resolution)
	}

	// If no variants were processed (e.g., source is 240p but we requested 1080p/720p/480p/360p)
	// Process at source resolution to ensure we have at least one variant
	if !processedAnyVariant {
		log.Warnf("No target resolutions matched source quality, processing at source resolution (%dp)", metadata.Height)

		sourceResolution := fmt.Sprintf("%dp", metadata.Height)
		sourceDir := filepath.Join(localOutputDir, "source")
		os.MkdirAll(sourceDir, 0755)

		playlistPath := filepath.Join(sourceDir, "playlist.m3u8")
		segmentPattern := filepath.Join(sourceDir, "segment_%03d.ts")

		// Use conservative bitrate based on source height
		sourceBitrate := fmt.Sprintf("%dk", metadata.Height*2) // Simple heuristic: 2k per vertical pixel

		args := []string{
			"-i", localInput,
			"-c:v", "libx264",
			"-b:v", sourceBitrate,
			"-preset", "medium",
			"-crf", "23",
			"-c:a", "aac",
			"-b:a", "128k",
			"-ac", "2",
			"-ar", "48000",
			"-hls_time", "6",
			"-hls_playlist_type", "vod",
			"-hls_segment_filename", segmentPattern,
			"-f", "hls",
			playlistPath,
		}

		cmd := exec.Command("ffmpeg", args...)
		output, err := cmd.CombinedOutput()
		if err != nil {
			vp.sendFailureCallback(videoID, fmt.Sprintf("Failed to process source quality: %s", string(output)))
			return fmt.Errorf("source quality processing failed: %w", err)
		}

		// Upload source quality variant
		sourceOutputPath := fmt.Sprintf("%s/source", outputBasePath)
		if err := vp.uploadDirectory(sourceDir, sourceOutputPath); err != nil {
			log.Errorf("Failed to upload source variant: %v", err)
		} else {
			playlistURL := fmt.Sprintf("%s/playlist.m3u8", sourceOutputPath)

			// Since we only have one variant, use simple playlist format
			masterPlaylistLines = append(masterPlaylistLines,
				fmt.Sprintf("#EXT-X-STREAM-INF:BANDWIDTH=%d,RESOLUTION=%dx%d",
					metadata.Bitrate,
					metadata.Width,
					metadata.Height,
				),
				"source/playlist.m3u8",
			)

			variantPlaylists = append(variantPlaylists, map[string]interface{}{
				"resolution":  sourceResolution,
				"playlistUrl": playlistURL,
				"bandwidth":   metadata.Bitrate,
			})

			log.Infof("Successfully processed source quality variant (%s)", sourceResolution)
		}
	}

	// Generate and upload master playlist
	masterPlaylistPath := filepath.Join(localOutputDir, "master.m3u8")
	masterContent := strings.Join(masterPlaylistLines, "\n")
	if err := os.WriteFile(masterPlaylistPath, []byte(masterContent), 0644); err != nil {
		vp.sendFailureCallback(videoID, fmt.Sprintf("Failed to create master playlist: %v", err))
		return fmt.Errorf("failed to create master playlist: %w", err)
	}

	masterOutputPath := fmt.Sprintf("%s/master.m3u8", outputBasePath)
	if err := vp.storage.UploadFile(masterPlaylistPath, masterOutputPath); err != nil {
		vp.sendFailureCallback(videoID, fmt.Sprintf("Failed to upload master playlist: %v", err))
		return fmt.Errorf("failed to upload master playlist: %w", err)
	}

	log.Infof("HLS processing completed successfully")

	// Delete raw video if requested
	if deleteRaw {
		log.Infof("Deleting raw video from storage")
		if err := vp.storage.DeleteFile(rawVideoURL); err != nil {
			log.Warnf("Failed to delete raw video: %v", err)
		}
	}

	// Send success callback to API
	// Use simple path - API will prepend proper storage URL scheme
	// thumbnailOutputPath is empty since thumbnails are in thumbnailOptions from Phase 1
	thumbnailOutputPath := ""
	vp.sendSuccessCallback(videoID, masterOutputPath, thumbnailOutputPath, variantPlaylists, duration, metadata)

	log.Infof("Successfully processed video %s into HLS format", videoID)
	return nil
}

// Helper functions

func (vp *VideoProcessor) extractVideoMetadata(filePath string) (*VideoMetadata, float64, error) {
	cmd := exec.Command("ffprobe",
		"-v", "quiet",
		"-print_format", "json",
		"-show_format",
		"-show_streams",
		"-select_streams", "v:0",
		filePath,
	)

	output, err := cmd.CombinedOutput()
	if err != nil {
		return nil, 0, fmt.Errorf("ffprobe failed: %w", err)
	}

	var result struct {
		Streams []struct {
			Width      int    `json:"width"`
			Height     int    `json:"height"`
			CodecName  string `json:"codec_name"`
			BitRate    string `json:"bit_rate"`
			RFrameRate string `json:"r_frame_rate"`
		} `json:"streams"`
		Format struct {
			Duration string `json:"duration"`
		} `json:"format"`
	}

	if err := json.Unmarshal(output, &result); err != nil {
		return nil, 0, fmt.Errorf("failed to parse metadata: %w", err)
	}

	if len(result.Streams) == 0 {
		return nil, 0, fmt.Errorf("no video streams found")
	}

	stream := result.Streams[0]
	bitrate, _ := strconv.Atoi(stream.BitRate)

	// Parse frame rate
	fps := 30.0
	if stream.RFrameRate != "" {
		parts := strings.Split(stream.RFrameRate, "/")
		if len(parts) == 2 {
			num, _ := strconv.ParseFloat(parts[0], 64)
			den, _ := strconv.ParseFloat(parts[1], 64)
			if den > 0 {
				fps = num / den
			}
		}
	}

	duration, _ := strconv.ParseFloat(result.Format.Duration, 64)

	metadata := &VideoMetadata{
		Width:   stream.Width,
		Height:  stream.Height,
		Codec:   stream.CodecName,
		Bitrate: bitrate,
		FPS:     fps,
	}

	return metadata, duration, nil
}

// generateSmartThumbnails creates multiple thumbnail options using intelligent frame selection
func (vp *VideoProcessor) generateSmartThumbnails(
	inputPath string,
	videoID string,
	outputBasePath string,
	duration float64,
) ([]map[string]interface{}, error) {
	thumbnailOptions := []map[string]interface{}{}
	tmpDir := filepath.Join("/tmp", fmt.Sprintf("%s_thumbnails", videoID))
	os.MkdirAll(tmpDir, 0755)
	defer os.RemoveAll(tmpDir)

	// Strategy: Generate 5 thumbnails at different points
	// 1. Scene-based: Use FFmpeg scene detection to find interesting frames
	// 2. Temporal: Spread across video duration (avoid first/last 5%)
	timestamps := vp.calculateSmartTimestamps(duration)

	for i, timestamp := range timestamps {
		thumbnailName := fmt.Sprintf("thumbnail_%d.jpg", i)
		localPath := filepath.Join(tmpDir, thumbnailName)

		// Generate thumbnail with quality filters
		// - Scale to 1280x720
		// - Skip black frames
		// - Use high quality settings
		args := []string{
			"-ss", fmt.Sprintf("%.2f", timestamp),
			"-i", inputPath,
			"-vf", "select='not(mod(n\\,10))',scale=1280:720,thumbnail",
			"-frames:v", "1",
			"-q:v", "2", // High quality
			"-y",
			localPath,
		}

		cmd := exec.Command("ffmpeg", args...)
		output, err := cmd.CombinedOutput()
		if err != nil {
			log.Warnf("Failed to generate thumbnail %d at %.2fs: %s", i, timestamp, string(output))
			continue
		}

		// Upload to storage in thumbnails subdirectory
		remotePath := fmt.Sprintf("%s/thumbnails/%s", outputBasePath, thumbnailName)
		if err := vp.storage.UploadFile(localPath, remotePath); err != nil {
			log.Warnf("Failed to upload thumbnail %d: %v", i, err)
			continue
		}

		// Add to options array
		thumbnailOptions = append(thumbnailOptions, map[string]interface{}{
			"id":        fmt.Sprintf("thumb_%d", i),
			"url":       remotePath, // Simple path - API will add storage URL prefix
			"timestamp": timestamp,
			"index":     i,
		})

		log.Infof("Generated thumbnail %d at %.2fs", i, timestamp)
	}

	if len(thumbnailOptions) == 0 {
		return nil, fmt.Errorf("failed to generate any thumbnails")
	}

	return thumbnailOptions, nil
}

// calculateSmartTimestamps returns optimal timestamps for thumbnail extraction
func (vp *VideoProcessor) calculateSmartTimestamps(duration float64) []float64 {
	// Avoid first and last 5% of video (intros/outros/credits)
	startOffset := duration * 0.05
	endOffset := duration * 0.95
	usableDuration := endOffset - startOffset

	if usableDuration < 10 {
		// Very short video, just use 5 evenly spaced points
		return []float64{
			duration * 0.2,
			duration * 0.35,
			duration * 0.5,
			duration * 0.65,
			duration * 0.8,
		}
	}

	// For longer videos, spread thumbnails strategically:
	// - 15% (early content)
	// - 30% (first third)
	// - 50% (middle - often most representative)
	// - 70% (second third)
	// - 85% (late content)
	return []float64{
		startOffset + usableDuration*0.1, // ~15% mark
		startOffset + usableDuration*0.3, // ~30% mark
		startOffset + usableDuration*0.5, // ~50% mark (middle)
		startOffset + usableDuration*0.7, // ~70% mark
		startOffset + usableDuration*0.9, // ~85% mark
	}
}

func (vp *VideoProcessor) generateThumbnailAt(inputPath, outputPath string, timestamp int) error {
	args := []string{
		"-i", inputPath,
		"-ss", strconv.Itoa(timestamp),
		"-vframes", "1",
		"-vf", "scale=1280:720",
		"-y",
		outputPath,
	}

	cmd := exec.Command("ffmpeg", args...)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("thumbnail generation failed: %s", string(output))
	}

	return nil
}

func (vp *VideoProcessor) uploadDirectory(localDir, remotePath string) error {
	return filepath.Walk(localDir, func(path string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() {
			return err
		}

		relPath, _ := filepath.Rel(localDir, path)
		remotePath := filepath.Join(remotePath, relPath)

		return vp.storage.UploadFile(path, remotePath)
	})
}

func (vp *VideoProcessor) sendMetadataCallback(
	videoID string,
	thumbnailOptions []map[string]interface{},
	duration float64,
	metadata *VideoMetadata,
) {
	callback := map[string]interface{}{
		"videoId":          videoID,
		"thumbnailOptions": thumbnailOptions, // Array of thumbnail URLs with metadata
		"duration":         duration,
		"metadata":         metadata,
		"status":           "metadata_extracted",
		"extractedAt":      time.Now().Format(time.RFC3339),
	}

	if err := vp.callbackQueue.PublishJob("video-metadata-ready", callback); err != nil {
		log.Errorf("Failed to send metadata callback: %v", err)
	} else {
		log.Infof("Sent metadata callback for video %s with %d thumbnail options", videoID, len(thumbnailOptions))
	}
}

func (vp *VideoProcessor) sendSuccessCallback(
	videoID string,
	masterPlaylistURL string,
	thumbnailURL string,
	variantPlaylists []map[string]interface{},
	duration float64,
	metadata *VideoMetadata,
) {
	callback := map[string]interface{}{
		"videoId":           videoID,
		"masterPlaylistUrl": masterPlaylistURL,
		"thumbnailUrl":      thumbnailURL,
		"variantPlaylists":  variantPlaylists,
		"duration":          duration,
		"metadata":          metadata,
		"processedAt":       time.Now().Format(time.RFC3339),
	}

	if err := vp.callbackQueue.PublishJob("video-processing-complete", callback); err != nil {
		log.Errorf("Failed to send success callback: %v", err)
	}
}

func (vp *VideoProcessor) sendFailureCallback(videoID, errorMsg string) {
	callback := map[string]interface{}{
		"videoId":  videoID,
		"error":    errorMsg,
		"failedAt": time.Now().Format(time.RFC3339),
	}

	if err := vp.callbackQueue.PublishJob("video-processing-failed", callback); err != nil {
		log.Errorf("Failed to send failure callback: %v", err)
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
