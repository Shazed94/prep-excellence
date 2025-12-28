/**
 * Lesson Video Upload Component
 *
 * Handles video upload with encoding status tracking
 * Integrates with backend video-processor service
 */

import { AlertCircle, CheckCircle, Loader2, Upload } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
	useCheckVideoEncodingStatus,
	useUploadLessonVideo,
} from "@/hooks/lms-course";

interface LessonVideoUploadProps {
	lessonId: string;
	courseId: string;
	currentVideoUrl?: string | null;
	encodingStatus?: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | null;
	onUploadComplete?: () => void;
}

export function LessonVideoUpload({
	lessonId,
	courseId,
	currentVideoUrl,
	encodingStatus: initialEncodingStatus,
	onUploadComplete,
}: LessonVideoUploadProps) {
	const uploadInputId = useId();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isPolling, setIsPolling] = useState(false);

	const uploadMutation = useUploadLessonVideo();

	// Poll for encoding status after upload
	const { data: lessonData } = useCheckVideoEncodingStatus(
		courseId,
		lessonId,
		isPolling,
	);

	// Start polling if status is PENDING or PROCESSING
	useEffect(() => {
		if (
			initialEncodingStatus === "PENDING" ||
			initialEncodingStatus === "PROCESSING"
		) {
			setIsPolling(true);
		}
	}, [initialEncodingStatus]);

	// Stop polling when encoding completes or fails
	useEffect(() => {
		if (lessonData?.videoEncodingStatus === "COMPLETED") {
			setIsPolling(false);
			toast.success("Video encoding completed!");
			onUploadComplete?.();
		} else if (lessonData?.videoEncodingStatus === "FAILED") {
			setIsPolling(false);
			toast.error("Video encoding failed. Please try again.");
		}
	}, [lessonData?.videoEncodingStatus, onUploadComplete]);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("video/")) {
			toast.error("Please select a valid video file");
			return;
		}

		// Validate file size (e.g., max 500MB)
		const maxSize = 500 * 1024 * 1024; // 500MB
		if (file.size > maxSize) {
			toast.error("Video file is too large. Maximum size is 500MB.");
			return;
		}

		setSelectedFile(file);
	};

	const handleUpload = async () => {
		if (!selectedFile) return;

		try {
			setUploadProgress(0);

			await uploadMutation.mutateAsync({
				lessonId,
				courseId,
				file: selectedFile,
			});

			// Start polling for encoding status
			setIsPolling(true);
			setSelectedFile(null);
			setUploadProgress(100);
		} catch (error) {
			console.error("Upload failed:", error);
			setUploadProgress(0);
		}
	};

	const currentStatus =
		lessonData?.videoEncodingStatus || initialEncodingStatus;

	return (
		<div className="space-y-4 p-4 border rounded-lg">
			<h3 className="text-lg font-semibold">Video Upload</h3>

			{/* Current Video Status */}
			{currentVideoUrl && (
				<div className="space-y-2">
					<p className="text-sm text-muted-foreground">Current Video:</p>
					<video
						src={currentVideoUrl}
						controls
						className="w-full max-h-64 rounded-md"
					>
						<track kind="captions" />
					</video>

					{/* Encoding Status Badge */}
					{currentStatus && (
						<div className="flex items-center gap-2">
							{currentStatus === "COMPLETED" && (
								<>
									<CheckCircle className="h-4 w-4 text-green-500" />
									<span className="text-sm text-green-500">Ready to view</span>
								</>
							)}
							{currentStatus === "PROCESSING" && (
								<>
									<Loader2 className="h-4 w-4 animate-spin text-blue-500" />
									<span className="text-sm text-blue-500">
										Encoding video...
									</span>
								</>
							)}
							{currentStatus === "PENDING" && (
								<>
									<Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
									<span className="text-sm text-yellow-500">
										Queued for encoding
									</span>
								</>
							)}
							{currentStatus === "FAILED" && (
								<>
									<AlertCircle className="h-4 w-4 text-red-500" />
									<span className="text-sm text-red-500">Encoding failed</span>
								</>
							)}
						</div>
					)}
				</div>
			)}

			{/* Upload New Video */}
			<div className="space-y-2">
				<label htmlFor={uploadInputId} className="text-sm font-medium">
					{currentVideoUrl ? "Replace Video" : "Upload Video"}
				</label>

				<div className="flex items-center gap-2">
					<input
						id={uploadInputId}
						type="file"
						accept="video/*"
						onChange={handleFileSelect}
						className="hidden"
					/>
					<Button
						type="button"
						variant="outline"
						onClick={() => document.getElementById(uploadInputId)?.click()}
						disabled={uploadMutation.isPending}
					>
						<Upload className="h-4 w-4 mr-2" />
						Select Video
					</Button>

					{selectedFile && (
						<span className="text-sm text-muted-foreground">
							{selectedFile.name} (
							{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
						</span>
					)}
				</div>

				{selectedFile && (
					<Button
						onClick={handleUpload}
						disabled={uploadMutation.isPending}
						className="w-full"
					>
						{uploadMutation.isPending ? (
							<>
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								Uploading...
							</>
						) : (
							"Upload Video"
						)}
					</Button>
				)}

				{uploadMutation.isPending && uploadProgress > 0 && (
					<Progress value={uploadProgress} className="w-full" />
				)}
			</div>

			{/* Upload Instructions */}
			<div className="text-xs text-muted-foreground space-y-1">
				<p>• Maximum file size: 500MB</p>
				<p>• Supported formats: MP4, WebM, MOV</p>
				<p>• Video will be automatically encoded for optimal streaming</p>
				<p>• Encoding may take a few minutes depending on video length</p>
			</div>
		</div>
	);
}
