<?php

namespace App\Console\Commands;

use App\Events\CommonNotifyEvent;
use App\Models\PushNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class PushNotificationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'push:notification';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $notifications = PushNotification::where(['is_notify'=>0])->limit(50)->get(['id','subject','user_id','role_id','message','link','is_notify','channel_name','is_seen']);
        $success=[];
        $fails=[];
        if (count($notifications)>0){
            foreach ($notifications as $notification){
                try {
                    broadcast(new CommonNotifyEvent($notification));
                    $success[]=$notification->id;
                }catch (\Exception $e){
                    Log::info($e);
                }
            }
        }
        if(count($success)) PushNotification::whereIn('id',$success)->update(['is_notify'=>1]);
    }
}
