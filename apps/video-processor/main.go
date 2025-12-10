package main

import (
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
	log "github.com/sirupsen/logrus"
	"github.com/trodad-intl/prepexcellence/video-processor/internal/processor"
	"github.com/trodad-intl/prepexcellence/video-processor/internal/queue"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Warn("No .env file found, using system environment variables")
	}

	// Configure logging
	logLevel := os.Getenv("LOG_LEVEL")
	if logLevel == "" {
		logLevel = "info"
	}
	level, err := log.ParseLevel(logLevel)
	if err != nil {
		level = log.InfoLevel
	}
	log.SetLevel(level)
	log.SetFormatter(&log.JSONFormatter{})

	log.Info("Starting PrepExcellence Video Processor Service")

	// Initialize queue consumer
	queueURL := getEnv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
	queueName := getEnv("RABBITMQ_QUEUE", "video-processing")
	
	consumer, err := queue.NewConsumer(queueURL, queueName)
	if err != nil {
		log.Fatalf("Failed to initialize queue consumer: %v", err)
	}
	defer consumer.Close()

	// Initialize video processor
	videoProcessor := processor.NewVideoProcessor()

	// Start consuming messages
	log.Infof("Starting to consume from queue: %s", queueName)
	if err := consumer.Consume(videoProcessor.ProcessJob); err != nil {
		log.Fatalf("Failed to start consuming: %v", err)
	}

	// Wait for interrupt signal
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	log.Info("Shutting down gracefully...")
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
