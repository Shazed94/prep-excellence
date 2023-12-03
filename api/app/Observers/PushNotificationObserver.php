<?php

namespace App\Observers;

use App\Events\CommonNotifyEvent;
use App\Models\PushNotification;
use Illuminate\Support\Facades\Broadcast;

class PushNotificationObserver
{
    /**
     * Handle events after all transactions are committed.
     *
     * @var bool
     */
    public $afterCommit = true;

    /**
     * Handle the PushNotification "created" event.
     *
     * @param  \App\Models\PushNotification  $pushNotification
     * @return void
     */
    public function created(PushNotification $pushNotification)
    {
        try {
            Broadcast(new CommonNotifyEvent($pushNotification));
            $pushNotification->update(['is_notify'=>1]);
        }catch (\Exception $e){
            //
        }
    }

    /**
     * Handle the PushNotification "updated" event.
     *
     * @param  \App\Models\PushNotification  $pushNotification
     * @return void
     */
    public function updated(PushNotification $pushNotification)
    {
        //
    }

    /**
     * Handle the PushNotification "deleted" event.
     *
     * @param  \App\Models\PushNotification  $pushNotification
     * @return void
     */
    public function deleted(PushNotification $pushNotification)
    {
        //
    }

    /**
     * Handle the PushNotification "restored" event.
     *
     * @param  \App\Models\PushNotification  $pushNotification
     * @return void
     */
    public function restored(PushNotification $pushNotification)
    {
        //
    }

    /**
     * Handle the PushNotification "force deleted" event.
     *
     * @param  \App\Models\PushNotification  $pushNotification
     * @return void
     */
    public function forceDeleted(PushNotification $pushNotification)
    {
        //
    }
}
