# PrepExcellence Video Processor

Go-based microservice for processing video content into HLS (HTTP Live Streaming) format with adaptive bitrate streaming for the PrepExcellence LMS platform. Converts videos into multiple resolutions with chunked segments, just like YouTube.

## Features

- **HLS Streaming**: Converts videos to HLS format with .m3u8 playlists and .ts segments
- **Adaptive Bitrate**: Multiple resolutions (1080p, 720p, 480p, 360p) for adaptive streaming
- **Master Playlist**: Generates master.m3u8 for resolution switching
- **Chunked Segments**: 6-second video chunks for smooth streaming
- **Thumbnail Generation**: Extracts thumbnails at specific timestamps
- **Metadata Extraction**: Extracts video metadata using FFprobe
- **Queue-Based Processing**: Consumes jobs from RabbitMQ for async processing
- **Callback Notifications**: Notifies API when processing completes or fails
- **MinIO/S3 Integration**: Downloads and uploads files from/to object storage
- **Auto-Cleanup**: Deletes raw video after processing (configurable)
- **Retry Logic**: Automatic retry with configurable attempts
- **Graceful Shutdown**: Handles SIGTERM/SIGINT signals properly

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Video Upload Flow                          │
└─────────────────────────────────────────────────────────────────────┘

1. User uploads video
          │
          ▼
2. API saves raw video to MinIO
          │
          ▼
3. API gets MinIO URL (minio://uploads/raw-video.mp4)
          │
          ▼
4. API sends job to RabbitMQ (video-processing queue)
   {
     videoId: "123",
     rawVideoUrl: "minio://uploads/raw-video.mp4",
     outputBasePath: "videos/123"
   }
          │
          ▼
5. Go service consumes job
          │
          ▼
6. Go downloads raw video from MinIO
          │
          ▼
7. Go processes video:
   ├─ Extract metadata (resolution, duration, fps, etc.)
   ├─ Generate thumbnail
   └─ Create HLS variants:
      ├─ 1080p/ → playlist.m3u8 + segment_000.ts, segment_001.ts...
      ├─ 720p/  → playlist.m3u8 + segment_000.ts, segment_001.ts...
      ├─ 480p/  → playlist.m3u8 + segment_000.ts, segment_001.ts...
      ├─ 360p/  → playlist.m3u8 + segment_000.ts, segment_001.ts...
      └─ master.m3u8 (points to all resolutions)
          │
          ▼
8. Go uploads all HLS files to MinIO:
   videos/123/
     ├─ master.m3u8
     ├─ thumbnail.jpg
     ├─ 1080p/
     │   ├─ playlist.m3u8
     │   ├─ segment_000.ts
     │   └─ segment_001.ts...
     ├─ 720p/...
     ├─ 480p/...
     └─ 360p/...
          │
          ▼
9. Go deletes raw video from MinIO
          │
          ▼
10. Go sends callback to RabbitMQ (video-callback queue)
    {
      videoId: "123",
      masterPlaylistUrl: "minio://videos/123/master.m3u8",
      thumbnailUrl: "minio://videos/123/thumbnail.jpg",
      duration: 300.5,
      metadata: {...}
    }
          │
          ▼
11. API consumes callback
          │
          ▼
12. API updates database (status: ready, URLs, metadata)
          │
          ▼
13. Video ready for streaming! 🎉
```

## Prerequisites

- Go 1.23+
- FFmpeg (for video processing)
- RabbitMQ (for job queue)
- MinIO or S3-compatible storage

## Installation

### Local Development

```bash
# Navigate to the video processor directory
cd apps/video-processor

# Install Go dependencies
go mod download

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Run the service
go run main.go
```

### Docker

```bash
# Build the Docker image
docker build -t prepexcellence-video-processor .

# Run with Docker
docker run --env-file .env prepexcellence-video-processor
```

### Docker Compose

The service is included in the main docker-compose.yml:

```bash
# From the project root
docker-compose up video-processor
```

## Configuration

Configure via environment variables (see `.env.example`):

### RabbitMQ
- `RABBITMQ_URL`: RabbitMQ connection URL (default: `amqp://guest:guest@rabbitmq:5672/`)
- `RABBITMQ_QUEUE`: Queue name to consume from (default: `video-processing`)
- `RABBITMQ_PREFETCH`: Number of messages to prefetch (default: `3`)
- `RABBITMQ_CALLBACK_QUEUE`: Callback queue name (default: `video-callback`)

### Storage (MinIO/S3)
- `MINIO_ENDPOINT`: MinIO endpoint (default: `minio:9000`)
- `MINIO_ACCESS_KEY`: Access key (default: `minioadmin`)
- `MINIO_SECRET_KEY`: Secret key (default: `minioadmin`)
- `MINIO_BUCKET`: Bucket name (default: `prepexcellence`)
- `MINIO_USE_SSL`: Use SSL/TLS (default: `false`)

### Processing
- `WORKER_COUNT`: Number of concurrent workers (default: `3`)
- `MAX_RETRIES`: Maximum retry attempts (default: `3`)
- `PROCESSING_TIMEOUT`: Timeout in seconds (default: `3600`)

### Logging
- `LOG_LEVEL`: Log level - debug, info, warn, error (default: `info`)
## Job Types

### Process Video to HLS

Converts a raw video into HLS format with multiple resolutions and chunked segments.

**Job sent TO Go service:**

```json
{
  "id": "unique-job-id",
  "jobName": "process-video-hls",
  "data": {
    "videoId": "video-123",
    "rawVideoUrl": "minio://uploads/raw-video.mp4",
    "outputBasePath": "videos/video-123",
    "resolutions": ["1080p", "720p", "480p", "360p"],
    "thumbnailTimestamp": 5,
    "deleteRawAfterProcessing": true
  }
}
```

**Callback sent FROM Go service (success):**

```json
{
  "jobName": "video-processing-complete",
  "data": {
    "videoId": "video-123",
    "masterPlaylistUrl": "minio://videos/video-123/master.m3u8",
    "thumbnailUrl": "minio://videos/video-123/thumbnail.jpg",
    "duration": 300.5,
    "variantPlaylists": [
      {
        "resolution": "1080p",
        "playlistUrl": "minio://videos/video-123/1080p/playlist.m3u8",
        "bandwidth": 5000000
      },
      {
        "resolution": "720p",
        "playlistUrl": "minio://videos/video-123/720p/playlist.m3u8",
        "bandwidth": 2800000
      }
    ],
    "metadata": {
      "width": 1920,
      "height": 1080,
      "codec": "h264",
      "bitrate": 8000000,
      "fps": 30.0
    },
    "processedAt": "2025-12-09T10:30:00Z"
  }
## Usage from API

### Step 1: Upload Raw Video to MinIO

```typescript
import { storageService } from '../infrastructure/storage';
import { videoJobs } from '../lib/queue-processors';

// Upload video file to MinIO
const rawVideoPath = await storageService.uploadFile(
  videoFile,
  `uploads/${videoId}_raw.mp4`
);
// Returns: "uploads/video-123_raw.mp4"
```

### Step 2: Enqueue Processing Job

```typescript
// Send to video processor
await videoJobs.processVideoHLS(
  'video-123',
  `minio://${rawVideoPath}`,
  `videos/${videoId}`,
  {
    resolutions: ['1080p', '720p', '480p', '360p'], // Optional
    thumbnailTimestamp: 5, // Optional: seconds
    deleteRawAfterProcessing: true // Optional: default true
  }
);
```

### Step 3: Handle Callback (Automatic)

The callback processor in `queue-processors.ts` automatically handles the completion:

```typescript
// This runs automatically when Go service finishes
queueService.processJob<VideoProcessingCompleteData>(
  QUEUE_NAMES.VIDEO_CALLBACK,
  JOB_TYPES.VIDEO_PROCESSING_COMPLETE,
  5,
  async (job: Job<VideoProcessingCompleteData>) => {
    // Update database
    await prisma.video.update({
      where: { id: job.data.videoId },
      data: {
        status: 'ready',
        masterPlaylistUrl: job.data.masterPlaylistUrl,
        thumbnailUrl: job.data.thumbnailUrl,
        duration: job.data.duration,
        // ... metadata
      }
    });
  }
);
```

### Step 4: Stream Video to Users

```typescript
// Frontend player URL
const videoUrl = `https://cdn.prepexcellence.com/videos/video-123/master.m3u8`;

// Use with video.js, hls.js, or native HLS player
<video src={videoUrl} controls />
``` └── ...
├── 720p/
│   ├── playlist.m3u8
│   ├── segment_000.ts
│   └── ...
├── 480p/
│   └── ...
└── 360p/
    └── ...
```
```

## Usage from API

Use the provided helper functions in `apps/api/src/lib/queue-processors.ts`:

```typescript
import { videoJobs } from '../lib/queue-processors';

// Transcode video
await videoJobs.transcodeVideo(
  'video-123',
  'uploads/original.mp4',
  'videos/720p/output.mp4',
  '720p'
);

// Generate thumbnail
await videoJobs.generateThumbnail(
  'video-123',
  'videos/original.mp4',
  'thumbnails/thumb.jpg',
  5 // timestamp in seconds
);

// Extract metadata
await videoJobs.extractMetadata(
  'video-123',
  'videos/original.mp4'
);
```

## Project Structure

```
video-processor/
├── main.go                           # Application entry point
├── go.mod                            # Go module definition
├── go.sum                            # Go dependencies lock
├── Dockerfile                        # Docker build configuration
├── .env.example                      # Environment variables template
├── internal/
│   ├── queue/
│   │   ├── consumer.go              # RabbitMQ consumer (receives jobs)
│   │   └── producer.go              # RabbitMQ producer (sends callbacks)
│   ├── processor/
│   │   └── processor.go             # HLS video processing logic
│   └── storage/
│       └── minio.go                 # MinIO/S3 client
└── README.md                         # This file
```

## HLS Processing Details

### Resolutions & Bitrates

| Resolution | Video Bitrate | Audio Bitrate | Bandwidth    | Usage          |
|------------|---------------|---------------|--------------|----------------|
| 1080p      | 5000k         | 192k          | 5,000,000    | High quality   |
| 720p       | 2800k         | 128k          | 2,800,000    | Standard HD    |
| 480p       | 1400k         | 128k          | 1,400,000    | Mobile/WiFi    |
| 360p       | 800k          | 96k           | 800,000      | Low bandwidth  |

### Adaptive Streaming

The master.m3u8 playlist allows players to automatically switch between resolutions based on:
- Available bandwidth
- Screen size
- Network conditions

**Example master.m3u8:**

```m3u8
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
1080p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
720p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=854x480
480p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p/playlist.m3u8
```

## Development

### Running Tests

```bash
go test ./...
```

### Building

```bash
# Build for current platform
go build -o video-processor .

# Build for Linux (for Docker)
GOOS=linux GOARCH=amd64 go build -o video-processor .
```

### Adding New Job Types

1. Add job type constant in `internal/processor/processor.go`
2. Add case in `ProcessJob` switch statement
3. Implement the processing function
4. Add corresponding job type and interfaces to API (`apps/api/src/lib/queue-processors.ts`)
5. Add callback handling if needed

### Processing a Different Segment Duration

Change the `-hls_time` parameter in `processor.go`:

```go
"-hls_time", "10", // 10 second segments instead of 6
```

### Adding Custom Resolutions

Add to `resolutionConfigs` map in `processor.go`:

```go
"2160p": {Height: 2160, Bandwidth: 10000000, VideoBitrate: "10000k", AudioBitrate: "256k"},
```

## Monitoring

The service logs all activities in JSON format. Key log fields:

- `level`: Log level (info, warn, error)
- `msg`: Log message
- `time`: Timestamp
- `job_id`: Job identifier (when processing jobs)
- `job_type`: Type of job being processed

Example log output:

```json
{"level":"info","msg":"Processing job: abc-123 (type: transcode-video)","time":"2025-12-09T10:30:00Z"}
{"level":"info","msg":"Transcoding video video-123 to 720p","time":"2025-12-09T10:30:01Z"}
{"level":"info","msg":"Successfully transcoded video video-123","time":"2025-12-09T10:35:00Z"}
{"level":"info","msg":"Job abc-123 completed successfully","time":"2025-12-09T10:35:00Z"}
```

## Performance Considerations

- **Concurrent Processing**: Configure `WORKER_COUNT` based on CPU cores
- **Disk Space**: Ensure sufficient `/tmp` space for video processing
- **Memory**: Video transcoding is memory-intensive; monitor container memory
- **Network**: MinIO downloads/uploads can be bandwidth-intensive

## Troubleshooting

### FFmpeg not found
Ensure FFmpeg is installed in the container or on your system.

### Connection refused (RabbitMQ)
Check that RabbitMQ is running and accessible at the configured URL.

### Storage errors
Verify MinIO/S3 credentials and bucket permissions.

### Out of memory
Reduce `WORKER_COUNT` or increase container memory limits.

## License

Part of the PrepExcellence platform.
