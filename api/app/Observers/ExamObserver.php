<?php

namespace App\Observers;
use App\Models\Email;
use App\Models\Exam;
use App\Traits\CommonTrait;
use App\Traits\CourseTrait;
use App\Traits\EmailTrait;
use App\Traits\PushNotificationTrait;

class ExamObserver
{
    use CourseTrait, PushNotificationTrait;
    /**
     * Handle events after all transactions are committed.
     *
     * @var bool
     */
    public $afterCommit = true;

    /**
     * Handle the Exam "created" event.
     *
     * @param  \App\Models\Exam  $exam
     * @return void
     */
    public function created(Exam $exam)
    {
        try {
            $course = $exam->course;
            $emails = $this->getStudentAndParentEmail($exam->course);
            $email_data=[];
            foreach ($emails as $email){
                $email_data[]=[
                    'subject'=>'New Test Created',
                    'email'=>$email,
                    'message'=>"New Test Created for course $course->name and test title is $exam->title",
                    'created_at'=>now(),
                    'updated_at'=>now(),
                ];
            }
            if (count($email_data)) Email::insert($email_data);
            $this->adminNotify('New Test Created','New Exam Created','admin-notify-channel-','/admin/Exam');

        }catch (\Exception $e){
            //
        }

    }

    /**
     * Handle the Exam "updated" event.
     *
     * @param  \App\Models\Exam  $exam
     * @return void
     */
    public function updated(Exam $exam)
    {
        //
    }

    /**
     * Handle the Exam "deleted" event.
     *
     * @param  \App\Models\Exam  $exam
     * @return void
     */
    public function deleted(Exam $exam)
    {
        //
    }

    /**
     * Handle the Exam "restored" event.
     *
     * @param  \App\Models\Exam  $exam
     * @return void
     */
    public function restored(Exam $exam)
    {
        //
    }

    /**
     * Handle the Exam "force deleted" event.
     *
     * @param  \App\Models\Exam  $exam
     * @return void
     */
    public function forceDeleted(Exam $exam)
    {
        //
    }
}
