<?php

namespace App\Traits;
use App\Models\Email;
use App\Models\PushNotification;
use App\Models\SMS;
use App\Models\User;

trait NotificationTrait
{
    use FileUploadTrait;
    /*
     * method for image upload
     * */
    protected function storeNotification($data, $file = null)
    {
        unset($data['file']);
        $users = User::query();
        if (isset($data['role_ids']) && $data['role_ids']){
            $users->whereIn('role_id',$data['role_ids']);
        }
        $users = $users->get(['id','first_name','last_name','email','phone_number']);
        // in exist email
        if(in_array(1, $data['notifications']))
        {
            if ($file){
                $video = $this->videoUpload($file,'email/notification');
                $data +=[
                    'file'=>$video,
                ];
            }
            $notification_data=[];
            foreach ($users->where('email','!=', null) as $user){
                $temp=[
                    'subject'=>$data['subject'],
                    'name'=>$user->first_name.' '. $user->last_name,
                    'email'=>$user->email,
                    'message'=>$data['message'],
                    'file'=>isset($data['file'])?$data['file']:null,
                    'is_sent'=>0,
                    'try'=>0,
                    'created_at'=>now(),
                    'updated_at'=>now(),
                ];
                $notification_data[]=$temp;
            }
            if (count($notification_data) >0 ) Email::insert($notification_data);
        }
        // in exist sms
        if(in_array(2, $data['notifications']))
        {
            $notification_data=[];
            foreach ($users->where('phone_number','!=', null) as $user){
                $temp=[
                    'msisdn'=>$user->phone_number,
                    'text'=>$data['message'],
                    'csms_id'=>uniqid(),
                    'is_sent'=>0,
                    'try'=>0,
                    'created_at'=>now(),
                    'updated_at'=>now(),
                ];
                $notification_data[]=$temp;
            }
            if (count($notification_data) >0 ) SMS::insert($notification_data);
        }
        // in exist push notification
        if(in_array(3, $data['notifications']))
        {
            $notification_data=[];
            foreach ($users as $user){
                $temp=[
                    'user_id'=>$user->id,
                    'subject'=>$data['subject'],
                    'message'=>$data['message'],
                    'is_notify'=>0,
                    'channel_name'=>'user-channel-'.$user->id,
                    'is_seen'=>0,
                    'created_at'=>now(),
                    'updated_at'=>now(),
                ];
                $notification_data[]=$temp;
            }
            if (count($notification_data) >0 ) PushNotification::insert($notification_data);
        }

    }

}
