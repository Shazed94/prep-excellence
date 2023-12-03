<?php
namespace App\Traits;

use App\Mail\DefaultMail;
use App\Mail\OrderConfirm;
use App\Mail\OrderConfirm2;
use App\Mail\TutoringOrder;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

trait EmailTrait{

    protected function defaultEmail($name, $email,$subject,$message): void
    {
        $data=[
            'name'=>$name,
            'email'=>$email,
            'subject'=>$subject,
            'message'=>$message,
        ];
        try {
            Mail::to($email)->bcc(env('ADMIN_NOTIFY_MAIL'))->send(new DefaultMail($data));
        }catch (\Exception $e){
            //
        }
    }

    protected function passwordRestEmail($email,$message,$name=null): void
    {
        $data=[
            'name'=>$name,
            'email'=>$email,
            'subject'=>'Password reset request',
            'message'=>$message,
        ];
        try {
            Mail::to($email)->send(new DefaultMail($data));
        }catch (\Exception $e){
            //
        }
    }

    protected function confirmOrder($student_course,$subject): void
    {
        try {
            $user = $this->findUserById(Student::find($student_course->student_id));
            $parent_email = $this->getParentEmail($user);
            $bcc = [
                env('ADMIN_NOTIFY_MAIL')
            ];
            if ($parent_email) $bcc []= $parent_email;;
            Mail::to($user->email)->cc($bcc)->send(new OrderConfirm($subject, $student_course, false));
        }catch (\Exception $e){
            //
        }
    }

    protected function confirmOrder2($order, $subject): void
    {
        try {
            $user = User::find($order->user_id);
            $parent_email = $this->getParentEmail($user);
            $bcc = [
                env('ADMIN_NOTIFY_MAIL')
            ];
            if ($parent_email) $bcc []= $parent_email;
            logger($bcc);
            Mail::to($user->email)->bcc($bcc)->send(new OrderConfirm2($subject, $order, false));

        }catch (\Exception $e){
            //
        }
    }

    protected function tutoringOrder($tutoring, $subject): void
    {
        try {
            $user = User::find($tutoring->user_id);
            $parent_email = $this->getParentEmail($user);
            $bcc = [
                env('ADMIN_NOTIFY_MAIL')
            ];
            if ($parent_email) $bcc []= $parent_email;
            Mail::to($user->email)->bcc($bcc)->send(new TutoringOrder($subject, $tutoring, false));
       }catch (\Exception $e){
            //
        }
    }

    private function getParentEmail($user){
        try {
            $student = $user->userable;
            if (isset($student->id) && $student->date_of_birth){
                $age = Carbon::parse($student->date_of_birth)->diff(Carbon::now())->format('%y');
                if ($age <18){
                    $parent = $student->parents;
                    if (isset($parent->id)){
                        $p_user = $parent->userable;
                        if (isset($p_user->id)){
                            if ($p_user->email) return $p_user->email;
                        }
                    }
                }
            }
        }catch (\Exception $e){
            //
        }
        return null;
    }

}
