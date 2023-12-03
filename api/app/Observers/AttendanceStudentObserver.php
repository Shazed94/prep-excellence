<?php

namespace App\Observers;
use App\Models\AttendanceStudent;
use App\Models\Email;
use App\Traits\CourseTrait;

class AttendanceStudentObserver
{
    use CourseTrait;
    /**
     * Handle events after all transactions are committed.
     *
     * @var bool
     */
    public $afterCommit = true;

    /**
     * Handle the AttendanceStudent "created" event.
     *
     * @param  \App\Models\AttendanceStudent  $attendanceStudent
     * @return void
     */
    public function created(AttendanceStudent $attendanceStudent)
    {
        try {
            if ($attendanceStudent->attendance_status_id != 2){
                $course = $attendanceStudent->course;
                $student = $attendanceStudent->student;
                $email = $this->getParentEmail($student);
                $status = $attendanceStudent->attendance_status_id==3 ?'Late present':'Absent';
                $email_data=[
                    'name'=>'Parents',
                    'subject'=>"Your Child is $status",
                    'email'=>$email,
                    'message'=>"Your Child was $status today for class $course->name",
                ];
                Email::create($email_data);
            }
        }catch (\Exception $e){
            //
        }

    }

    /**
     * Handle the AttendanceStudent "updated" event.
     *
     * @param  \App\Models\AttendanceStudent  $attendanceStudent
     * @return void
     */
    public function updated(AttendanceStudent $attendanceStudent)
    {
        //
    }

    /**
     * Handle the AttendanceStudent "deleted" event.
     *
     * @param  \App\Models\AttendanceStudent  $attendanceStudent
     * @return void
     */
    public function deleted(AttendanceStudent $attendanceStudent)
    {
        //
    }

    /**
     * Handle the AttendanceStudent "restored" event.
     *
     * @param  \App\Models\AttendanceStudent  $attendanceStudent
     * @return void
     */
    public function restored(AttendanceStudent $attendanceStudent)
    {
        //
    }

    /**
     * Handle the AttendanceStudent "force deleted" event.
     *
     * @param  \App\Models\AttendanceStudent  $attendanceStudent
     * @return void
     */
    public function forceDeleted(AttendanceStudent $attendanceStudent)
    {
        //
    }
}
