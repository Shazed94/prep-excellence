package storage

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	log "github.com/sirupsen/logrus"
)

// S3Storage handles file operations with S3-compatible storage
type S3Storage struct {
	client *minio.Client
	bucket string
}

// NewS3Storage creates a new S3-compatible storage client
func NewS3Storage() (*S3Storage, error) {
	endpoint := getEnv("S3_ENDPOINT", "localhost:9000")
	accessKey := getEnv("S3_ACCESS_KEY", "minioadmin")
	secretKey := getEnv("S3_SECRET_KEY", "minioadmin")
	bucket := getEnv("S3_BUCKET", "prepexcellence")
	useSSL := getEnv("S3_USE_SSL", "false") == "true"

	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create S3 client: %w", err)
	}

	// Ensure bucket exists
	ctx := context.Background()
	exists, err := client.BucketExists(ctx, bucket)
	if err != nil {
		return nil, fmt.Errorf("failed to check bucket: %w", err)
	}

	if !exists {
		log.Warnf("Bucket %s does not exist", bucket)
	}

	log.Infof("Connected to S3-compatible storage, bucket: %s", bucket)

	return &S3Storage{
		client: client,
		bucket: bucket,
	}, nil
}

// DownloadFile downloads a file from S3-compatible storage to local path
func (s *S3Storage) DownloadFile(objectName, localPath string) error {
	ctx := context.Background()

	// Ensure directory exists
	if err := os.MkdirAll(filepath.Dir(localPath), 0755); err != nil {
		return fmt.Errorf("failed to create directory: %w", err)
	}

	// Get object from storage
	object, err := s.client.GetObject(ctx, s.bucket, objectName, minio.GetObjectOptions{})
	if err != nil {
		return fmt.Errorf("failed to get object: %w", err)
	}
	defer object.Close()

	// Create local file
	localFile, err := os.Create(localPath)
	if err != nil {
		return fmt.Errorf("failed to create local file: %w", err)
	}
	defer localFile.Close()

	// Copy object to local file
	if _, err = io.Copy(localFile, object); err != nil {
		return fmt.Errorf("failed to download file: %w", err)
	}

	log.Infof("Downloaded %s to %s", objectName, localPath)
	return nil
}

// UploadFile uploads a local file to S3-compatible storage
func (s *S3Storage) UploadFile(localPath, objectName string) error {
	ctx := context.Background()

	// Upload file
	_, err := s.client.FPutObject(ctx, s.bucket, objectName, localPath, minio.PutObjectOptions{
		ContentType: "application/octet-stream",
	})
	if err != nil {
		return fmt.Errorf("failed to upload file: %w", err)
	}

	log.Infof("Uploaded %s to %s", localPath, objectName)
	return nil
}

// DeleteFile deletes a file from S3-compatible storage
func (s *S3Storage) DeleteFile(objectName string) error {
	ctx := context.Background()

	// Strip any storage URL scheme prefix (s3://, minio://, storage://)
	objectName = stripStoragePrefix(objectName)

	err := s.client.RemoveObject(ctx, s.bucket, objectName, minio.RemoveObjectOptions{})
	if err != nil {
		return fmt.Errorf("failed to delete file: %w", err)
	}

	log.Infof("Deleted %s from storage", objectName)
	return nil
}

// DownloadFileFromURL downloads a file from S3-compatible storage using a URL
func (s *S3Storage) DownloadFileFromURL(url, localPath string) error {
	// Strip storage URL scheme prefix
	objectName := stripStoragePrefix(url)
	
	// Use regular DownloadFile
	return s.DownloadFile(objectName, localPath)
}

// stripStoragePrefix removes common S3-compatible storage URL prefixes
func stripStoragePrefix(path string) string {
	// Support various S3-compatible URL schemes
	prefixes := []string{"s3://", "minio://", "storage://", "r2://"}
	for _, prefix := range prefixes {
		if strings.HasPrefix(path, prefix) {
			return strings.TrimPrefix(path, prefix)
		}
	}
	return path
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
