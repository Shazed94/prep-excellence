<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Hash;

class EmailVerificationMail extends Notification
{
    use Queueable;

    protected $user_id;
    protected $token;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($user_id, $token)
    {
        $this->user_id = $user_id;
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $url = env('FRONTEND_URL') . '/' . $this->user_id . '/' . $this->token.'/email-verify';
        return (new MailMessage)
            ->from(env('ADMIN_NOTIFY_MAIL'), env('APP_NAME'))
            ->subject(env('APP_NAME') . ' account verification')
            ->line('Thank you for signing up. Please verify your account by clicking the verify button.')
            ->action('Verify Now', $url);
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
