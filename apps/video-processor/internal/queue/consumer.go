package queue

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
	log "github.com/sirupsen/logrus"
)

// Job represents a job message from RabbitMQ
type Job struct {
	ID          string                 `json:"id"`
	QueueName   string                 `json:"queueName"`
	JobName     string                 `json:"jobName"`
	Data        map[string]interface{} `json:"data"`
	Attempts    int                    `json:"attempts"`
	MaxAttempts int                    `json:"maxAttempts"`
	Timestamp   int64                  `json:"timestamp"`
}

// JobHandler is a function that processes a job
type JobHandler func(*Job) error

// Consumer handles RabbitMQ message consumption
type Consumer struct {
	conn    *amqp.Connection
	channel *amqp.Channel
	queue   string
}

// NewConsumer creates a new RabbitMQ consumer
func NewConsumer(url, queueName string) (*Consumer, error) {
	conn, err := amqp.Dial(url)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to RabbitMQ: %w", err)
	}

	channel, err := conn.Channel()
	if err != nil {
		conn.Close()
		return nil, fmt.Errorf("failed to open channel: %w", err)
	}

	// Declare queue (idempotent)
	_, err = channel.QueueDeclare(
		queueName, // name
		true,      // durable
		false,     // delete when unused
		false,     // exclusive
		false,     // no-wait
		nil,       // arguments
	)
	if err != nil {
		channel.Close()
		conn.Close()
		return nil, fmt.Errorf("failed to declare queue: %w", err)
	}

	// Set prefetch count
	err = channel.Qos(
		3,     // prefetch count
		0,     // prefetch size
		false, // global
	)
	if err != nil {
		channel.Close()
		conn.Close()
		return nil, fmt.Errorf("failed to set QoS: %w", err)
	}

	log.Infof("Connected to RabbitMQ, queue: %s", queueName)

	return &Consumer{
		conn:    conn,
		channel: channel,
		queue:   queueName,
	}, nil
}

// Consume starts consuming messages and processing them with the handler
func (c *Consumer) Consume(handler JobHandler) error {
	msgs, err := c.channel.Consume(
		c.queue, // queue
		"",      // consumer tag
		false,   // auto-ack
		false,   // exclusive
		false,   // no-local
		false,   // no-wait
		nil,     // args
	)
	if err != nil {
		return fmt.Errorf("failed to register consumer: %w", err)
	}

	// Process messages in a goroutine
	go func() {
		for msg := range msgs {
			var job Job
			if err := json.Unmarshal(msg.Body, &job); err != nil {
				log.Errorf("Failed to unmarshal job: %v", err)
				msg.Nack(false, false) // Don't requeue malformed messages
				continue
			}

			log.Infof("Processing job: %s (type: %s)", job.ID, job.JobName)

			// Process the job
			if err := handler(&job); err != nil {
				log.Errorf("Job %s failed: %v", job.ID, err)

				// Requeue if attempts remain
				if job.Attempts < job.MaxAttempts {
					log.Infof("Requeuing job %s (attempt %d/%d)", job.ID, job.Attempts+1, job.MaxAttempts)
					msg.Nack(false, true) // Requeue
				} else {
					log.Errorf("Job %s failed after %d attempts, moving to DLQ", job.ID, job.MaxAttempts)
					msg.Nack(false, false) // Don't requeue, move to DLQ
				}
				continue
			}

			log.Infof("Job %s completed successfully", job.ID)
			msg.Ack(false)
		}
	}()

	log.Info("Consumer started, waiting for messages...")
	return nil
}

// Close closes the consumer connection
func (c *Consumer) Close() {
	if c.channel != nil {
		c.channel.Close()
	}
	if c.conn != nil {
		c.conn.Close()
	}
	log.Info("Consumer closed")
}

// Helper functions

func generateID() string {
	bytes := make([]byte, 16)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}

func nowMillis() int64 {
	return time.Now().UnixNano() / int64(time.Millisecond)
}
