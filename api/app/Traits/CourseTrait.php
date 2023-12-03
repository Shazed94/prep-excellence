<?php

namespace App\Traits;
use App\Models\Course;
use App\Models\Employee;
use App\Models\EmployeeWorking;
use App\Models\User;
use Illuminate\Support\Carbon;

trait CourseTrait
{

    /*
     * method for get question qualities
     * */
    protected function employeeNewWorkAdd($courseSchedule)
    {
        try {
            $to = Carbon::createFromFormat('H:s:i', $courseSchedule->start_time);
            $from = Carbon::createFromFormat('H:s:i', $courseSchedule->end_time);

            $diff_in_min = $to->diffInMinutes($from);
            $emp = Employee::find($courseSchedule->employee_id);
            $course = Course::find($courseSchedule->course_id);
            $salary = $emp->employeeSubjectSalaries()->where('course_type_id',$course->course_type_id)->first();
            $data =[
                'course_schedule_id'=>$courseSchedule->id,
                'employee_id'=>$courseSchedule->employee_id,
                'date'=>Carbon::today(),
                'working_hour'=>$diff_in_min/60,
                'hour_rate'=>isset($salary->id) ? $salary->hour_rate : 0,
                'is_paid'=>0,
            ];
            EmployeeWorking::create($data);
        }catch (\Exception $e){

        }
    }

    protected function getStudentAndParentEmail($course){
        $students = $course->students;
        $emails = User::whereIn('id',$students->pluck('id'))->where('email','!=', null)->pluck('email')->toArray();
        foreach ($students as $student){
            $email = $this->getParentEmail($student);
            if ($email) $emails[]=$email;
        }
        return $emails;
    }

    protected function getParentEmail($student){
        $email=null;
        try {
            if (isset($student->id) && $student->date_of_birth){
                $age = Carbon::parse($student->date_of_birth)->diff(Carbon::now())->format('%y');
                if ($age < 18){
                    $parent = $student->parents;
                    if (isset($parent->id)){
                        $user = $parent->userable;
                        if (isset($user->id)){
                            if ($user->email) $email = $user->email;
                        }
                    }
                }
            }
        }catch (\Exception $e){
            //
        }
        return $email;
    }
    protected function getParentUserId($student){
        $id=null;
        try {
            if (isset($student->id) && $student->date_of_birth){
                $age = Carbon::parse($student->date_of_birth)->diff(Carbon::now())->format('%y');
                if ($age < 18){
                    $parent = $student->parents;
                    if (isset($parent->id)){
                        $user = $parent->userable;
                        if (isset($user->id)) $id = $user->id;
                    }
                }
            }
        }catch (\Exception $e){
            //
        }
        return $id;
    }
    protected function getEmployeeIdsByCourse($course){
        return $course->employees()->pluck('employees.id')->toArray();
    }
}
