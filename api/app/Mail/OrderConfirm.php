<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderConfirm extends Mailable
{
    use Queueable, SerializesModels;

    public $subject;
    public $order;
    public $print_btn;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($subject, $order, $print_btn)
    {
        $this->subject = $subject;
        $this->order = $order;
        $this->print_btn = $print_btn;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->subject)->view('email.order-confirm');
    }
}
