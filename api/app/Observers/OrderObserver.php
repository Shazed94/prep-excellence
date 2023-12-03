<?php

namespace App\Observers;
use App\Models\Order;
use App\Traits\CommonTrait;
use App\Traits\EmailTrait;
use App\Traits\PushNotificationTrait;

class OrderObserver
{
    use CommonTrait, EmailTrait, PushNotificationTrait;
    /**
     * Handle events after all transactions are committed.
     *
     * @var bool
     */
    public $afterCommit = true;

    /**
     * Handle the Order "created" event.
     *
     * @param  \App\Models\Order  $order
     * @return void
     */
    public function created(Order $order)
    {
        try {
            if ($order->coupon_id){
                $coupon = $order->coupon;
                $used = $coupon->used ?? 0;
                $coupon->update(['used'=>$used+1]);
            }
            $this->adminNotify('New Enrollment','Student Enroll a course','admin-notify-channel-','/admin/order');

        }catch (\Exception $e){
            //
        }

    }

    /**
     * Handle the Order "updated" event.
     *
     * @param  \App\Models\Order  $order
     * @return void
     */
    public function updated(Order $order)
    {
        //
    }

    /**
     * Handle the Order "deleted" event.
     *
     * @param  \App\Models\Order  $order
     * @return void
     */
    public function deleted(Order $order)
    {
        //
    }

    /**
     * Handle the Order "restored" event.
     *
     * @param  \App\Models\Order  $order
     * @return void
     */
    public function restored(Order $order)
    {
        //
    }

    /**
     * Handle the Order "force deleted" event.
     *
     * @param  \App\Models\Order  $order
     * @return void
     */
    public function forceDeleted(Order $order)
    {
        //
    }
}
