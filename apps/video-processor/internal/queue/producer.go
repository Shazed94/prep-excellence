package queue

import (
	"encoding/json"
	"fmt"

	amqp "github.com/rabbitmq/amqp091-go"
	log "github.com/sirupsen/logrus"
)

// Producer handles publishing messages to RabbitMQ
type Producer struct {
	conn    *amqp.Connection
	channel *amqp.Channel
	queue   string
}

// NewProducer creates a new RabbitMQ producer
func NewProducer(url, queueName string) (*Producer, error) {
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

	log.Infof("Producer connected to queue: %s", queueName)

	return &Producer{
		conn:    conn,
		channel: channel,
		queue:   queueName,
	}, nil
}

// PublishJob publishes a job to the queue
func (p *Producer) PublishJob(jobName string, data map[string]interface{}) error {
	job := map[string]interface{}{
		"id":        generateID(),
		"queueName": p.queue,
		"jobName":   jobName,
		"data":      data,
		"timestamp": nowMillis(),
	}

	body, err := json.Marshal(job)
	if err != nil {
		return fmt.Errorf("failed to marshal job: %w", err)
	}

	err = p.channel.Publish(
		"",      // exchange
		p.queue, // routing key
		false,   // mandatory
		false,   // immediate
		amqp.Publishing{
			DeliveryMode: amqp.Persistent,
			ContentType:  "application/json",
			Body:         body,
		},
	)
	if err != nil {
		return fmt.Errorf("failed to publish message: %w", err)
	}

	log.Infof("Published job %s to queue %s", jobName, p.queue)
	return nil
}

// Close closes the producer connection
func (p *Producer) Close() {
	if p.channel != nil {
		p.channel.Close()
	}
	if p.conn != nil {
		p.conn.Close()
	}
}
