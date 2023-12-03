<?php

namespace App\Console\Commands;

use App\Mail\NotificationMail;
use App\Models\Email;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EmailNotificationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:notification';

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
        $emails = Email::where('email','!=',null)->where(['try'=>0])->limit(50)->get(['id','name','email','subject','message','file']);
        $success=[];
        $fails=[];
        Email::whereIn('id',$emails->pluck('id'))->update(['try'=>1]);
        if (count($emails)>0){
            foreach ($emails as $email){
                try {
                    Mail::to($email)->send(new NotificationMail($email));
                    $success[]=$email->id;
                }catch (\Exception $e){
                    Log::info($e);
                }
            }
        }
        if(count($success)) Email::whereIn('id',$success)->update(['is_sent'=>1]);
    }
}
