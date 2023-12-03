<?php

namespace App\Observers;

use App\Models\ChatUser;
use App\Models\User;
use App\Traits\CommonTrait;
use App\Traits\EmailTrait;
use Illuminate\Support\Facades\Hash;

class UserObserver
{
    use CommonTrait,EmailTrait;
    /**
     * Handle events after all transactions are committed.
     *
     * @var bool
     */
    public $afterCommit = true;

    /**
     * Handle the User "created" event.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    public function created(User $user)
    {
        try {
            if ($user->status != 'verified'){
                //sent email
                $role = $user->role;
                $pass = rand(111111,99999999);
                $user->update(['password'=>Hash::make($pass)]);
                $subject="Welcome to ".env('APP_NAME');
                $message="<p>Your credentials are below <br></p>";
                $message .= "User ID: $user->email and default password: $pass ";
                if (isset($role->id)){
                    if ($role->type == 3 || $role->type == 4){
                        $message .= "Please </br><a href='".env('FRONTEND_URL')."' >Click</a> here for login";
                    }else{
                        $message .= "Please </br><a href='".env('BACKEND_URL')."' >Click</a> here for login";
                    }
                }
                $this->defaultEmail($user->first_name.' '.$user->last_name,$user->email,$subject,$message);
            }
            $ids = $this->findAdminRoles();
            if (count($ids)){
                $chat_users=[];
                $user_ids = User::whereIn('role_id',$ids)->pluck('id');
                foreach ($user_ids as $id){
                    $chat_users[]=[
                        'sender_id'=>$id,
                        'receiver_id'=>$user->id,
                        'created_at'=>now(),
                        'updated_at'=>now(),
                    ];
                }
                ChatUser::insert($chat_users);
            }
        }catch (\Exception $e){
            //
        }

    }

    /**
     * Handle the User "updated" event.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    public function updated(User $user)
    {
        //
    }

    /**
     * Handle the User "deleted" event.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    public function deleted(User $user)
    {
        $subject="Removed you ".env('APP_NAME');
        $message="<p>Your Account is removed<br></p>";
        $this->defaultEmail($user->first_name.' '.$user->last_name,$user->email,$subject,$message);

    }

    /**
     * Handle the User "restored" event.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    public function restored(User $user)
    {
        //
    }

    /**
     * Handle the User "force deleted" event.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    public function forceDeleted(User $user)
    {
        //
    }
}
