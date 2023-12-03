<?php

namespace App\Observers;

use App\Models\ChatUser;
use App\Models\Student;
use App\Models\StudentCourse;
use App\Traits\CommonTrait;
use App\Traits\CourseTrait;

class StudentCourseObserver
{
    use CommonTrait, CourseTrait;
    /**
     * Handle events after all transactions are committed.
     *
     * @var bool
     */
    public $afterCommit = true;

    /**
     * Handle the StudentCourse "created" event.
     *
     * @param  \App\Models\StudentCourse  $studentCourse
     * @return void
     */
    public function created(StudentCourse $studentCourse)
    {
        try {
            $this->chatUserInsert($studentCourse);
        }catch (\Exception $e){
            //
        }
    }

    /**
     * Handle the StudentCourse "updated" event.
     *
     * @param  \App\Models\StudentCourse  $studentCourse
     * @return void
     */
    public function updated(StudentCourse $studentCourse)
    {
        try {
            if ($studentCourse->is_approved){
                $this->chatUserInsert($studentCourse);
            }
        }catch (\Exception $e){
            //
        }
    }

    /**
     * Handle the StudentCourse "deleted" event.
     *
     * @param  \App\Models\StudentCourse  $studentCourse
     * @return void
     */
    public function deleted(StudentCourse $studentCourse)
    {
        //
    }

    /**
     * Handle the StudentCourse "restored" event.
     *
     * @param  \App\Models\StudentCourse  $studentCourse
     * @return void
     */
    public function restored(StudentCourse $studentCourse)
    {
        //
    }

    /**
     * Handle the StudentCourse "force deleted" event.
     *
     * @param  \App\Models\StudentCourse  $studentCourse
     * @return void
     */
    public function forceDeleted(StudentCourse $studentCourse)
    {
        //
    }

    protected function chatUserInsert($studentCourse){
        $ids = $this->courseToEmployeeUser($studentCourse->course_id);
        $std_user_id = $this->studentIdTOUser($studentCourse->student_id);
        $parent_user_id = $this->getParentUserId(Student::find($studentCourse->student_id));
        if (count($ids) && $std_user_id){
            $chat_users=[];
            foreach ($ids as $id){
                $exist = ChatUser::where(['sender_id'=>$id,'receiver_id'=>$std_user_id])->first();
                if (!isset($exist->id)){
                    $chat_users[]=[
                        'sender_id'=>$id,
                        'receiver_id'=>$std_user_id,
                        'created_at'=>now(),
                        'updated_at'=>now(),
                    ];
                }
                //prent link to chat
                if ($parent_user_id){
                    $exist2 = ChatUser::where(['sender_id'=>$id,'receiver_id'=>$parent_user_id])->first();
                    if (!isset($exist2->id)){
                        $chat_users[]=[
                            'sender_id'=>$id,
                            'receiver_id'=>$parent_user_id,
                            'created_at'=>now(),
                            'updated_at'=>now(),
                        ];
                    }
                }

            }
            ChatUser::insert($chat_users);
        }
    }
}
