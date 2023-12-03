<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentCollection;
use App\Models\AttendanceStatus;
use App\Models\AttendanceStudent;
use App\Models\Course;
use App\Models\CourseSchedule;
use App\Models\Student;
use App\Models\StudentCourse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;

class StudentAttendanceController extends Controller
{
    /*
     * method for get attendance status
     * */
    public function getAtStatus()
    {
        $status = AttendanceStatus::all(['id','name']);
        return response()->json($status,200);
    }

    /*
     * method for get student by course id
     * */
    public function students(Course $course)
    {
        $std_ids  = StudentCourse::where(['course_id'=> $course->id])->pluck('student_id');
        $students = Student::whereIn('id',$std_ids)->get(['id','student_id']);
        return new StudentCollection($students);
    }

    /*
     * method for store attendance
     * */
    public function store(Request $request)
    {
        $data2 = Validator::make($request->all(),[
            'course_id'=>'required|not_in:0|exists:courses,id',
            'student_ids'=>'required|exists:students,id',
            'attendance_status_ids'=>'required|exists:attendance_statuses,id',
            'course_schedule_id'=>'exists:course_schedules,id',
            'date'=>'required|date',
        ])->validate();
        if ($data2['date'] > Carbon::today()) return response()->json(['status'=>'error','message'=>'You can\'t take advance attendance'],404);
        //if (Carbon::parse($data2['date'])->format('Ymd') > Carbon::parse(Carbon::now())->format('Ymd')) return response()->json(['status'=>'error','message'=>'You can\'t take advance attendance'],404);

        $chk = AttendanceStudent::where(['course_id'=>$request->course_id,'course_schedule_id'=>$request->course_schedule_id])->count();
        if ($chk > 0) return response()->json(['status'=>'error','message'=>'You already take this day attendance'],404);
        $emp = auth()->user()->userable;
        //$attendances=[];
        foreach ($request->student_ids as $key=>$std){
            try {
                AttendanceStudent::create([
                    'course_id'=> $request->course_id,
                    'student_id'=> $std,
                    'employee_id'=> $emp->id,
                    'attendance_status_id'=> $request->attendance_status_ids[$key],
                    'course_schedule_id'=> $request->course_schedule_id,
                    'date'=> $request->date,
                ]);
            }catch (\Exception $e){

            };
        }
        //AttendanceStudent::insert($attendances);
        return response()->json(['status'=>'success','message'=>'Attendance take successfully'],200);
    }

    /*
     * get attendance report by course and course schedule id
     * */
    public function findAttendances(Course $course, CourseSchedule $courseSchedule)
    {
        $att = AttendanceStudent::where(['course_id'=>$course->id,'course_schedule_id'=>$courseSchedule->id])
            ->with([
                'student'=>function($q){$q->select('id','student_id');},
                'attendanceStatus'
            ])->get();
        return response()->json($att,200);
    }

}
