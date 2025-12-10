# Build stage
FROM golang:1.25-alpine AS builder

# Install FFmpeg and build dependencies
RUN apk add --no-cache ffmpeg git

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o video-processor .

# Runtime stage
FROM alpine:latest

# Install FFmpeg and CA certificates
RUN apk --no-cache add ffmpeg ca-certificates

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/video-processor .

# Create temp directory for video processing
RUN mkdir -p /tmp

# Run as non-root user
RUN adduser -D -u 1000 appuser && chown -R appuser:appuser /app /tmp
USER appuser

# Run the application
CMD ["./video-processor"]
