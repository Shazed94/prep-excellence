<?php

namespace App\Traits;
use App\Models\Email;
use App\Models\PushNotification;
use App\Models\User;
use http\Env;

trait PushNotificationTrait
{
    use CommonTrait;

    /*
     * method for push notification store
     * */
    protected function storePushNotification($notification){
        try {
            $pn = PushNotification::create($notification);
            $this->userSentEmail($pn->user_id,$pn->subject,$pn->message);
        }catch (\Exception $e){
            //
        }
    }

    protected function adminNotify($subject, $message, $channel='admin-notify-channel-', $link=null){
        try {
            $this->adminEmailSent($subject,$message);
        }catch (\Exception){}
        try {
            $role_ids = $this->findAdminRoles();
            if (count($role_ids) >0){
                $data2= [
                    'subject'=>$subject,
                    'user_id'=>null,
                    'role_id'=>null,
                    'message'=>$message,
                    'link'=>$link,
                    'is_notify'=>1,
                    'channel_name'=>$channel,
                    'is_seen'=>0,
                ];
                foreach ($role_ids as $id){
                    $data2['role_id']= $id;
                    $data2['channel_name'] = $channel.$id;
                    $this->storePushNotification($data2);
                }
            }
        }catch (\Exception $e){
            //
        }
    }
    protected function employeeNotifyById($ids,$subject, $message, $link=null){
        try {
            $users = $this->findEmployeeUserIdById($ids);
            if (count($users) >0){
                $data2= [
                    'subject'=>$subject,
                    'user_id'=>null,
                    'role_id'=>null,
                    'message'=>$message,
                    'link'=>$link,
                    'is_notify'=>1,
                    'channel_name'=>'',
                    'is_seen'=>0,
                ];
                foreach ($users as $id){
                    $data2['user_id'] = $id;
                    $data2['channel_name'] = 'user-channel-'.$id;
                    $this->storePushNotification($data2);
                    $this->userSentEmail($id,$subject,$message);
                }
            }
        }catch (\Exception $e){
            //
        }
    }
    protected function findEmployeeUserIdById($ids){
        return User::where('userable_type','App\Models\Employee')->whereIn('userable_id',$ids)->pluck('id');
    }

    private function adminEmailSent($subject, $message){
        $data=[
            'name'=>'Admin',
            'subject'=>$subject,
            'email'=>env('ADMIN_NOTIFY_MAIL'),
            'message'=>$message,
            'is_sent'=>0,
            'try'=>0
        ];
        $this->emailStore($data);
    }
    private function userSentEmail($id,$subject,$message){
        try {
            $user = User::find($id);
            if (isset($user->id) && $user->email){
                $data=[
                    'name'=>$user->name,
                    'subject'=>$subject,
                    'email'=>$user->email,
                    'message'=>$message,
                    'is_sent'=>0,
                    'try'=>0
                ];
                $this->emailStore($data);
            }
        }catch (\Exception $e){}
    }

    private function emailStore($data){
        try {
            Email::create($data);
        }catch (\Exception $e){}
    }
}
