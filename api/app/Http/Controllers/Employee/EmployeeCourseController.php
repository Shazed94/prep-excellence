<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseCollection;
use App\Http\Resources\CourseScheduleCollection;
use App\Http\Resources\CourseScheduleResource;
use App\Models\Course;
use App\Models\CourseSchedule;
use App\Models\CourseScheduleCancel;
use App\Traits\CourseTrait;
use App\Traits\PushNotificationTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;

class EmployeeCourseController extends Controller
{
    use CourseTrait, PushNotificationTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\CourseCollection
     */
    public function index(Request $request)
    {
        $emp = auth()->user()->userable;
        $course_ids = $emp->courseEmployees()->pluck('courses.id');
        $itemsPerPage = request('per_page') ?? 100;
        $search = request('search');
        $courses = Course::query();
        $courses->whereIn('id',$course_ids);
        if ($search) {
            $courses->whereLike(['name','batch','amount'], $search);
        }
        $courses=$courses->with(['courseType',
            'courseSchedules'=>function($q) use ($emp) {$q->where('employee_id',$emp->id);},
            'courseCategories','homeWorks','courseMaterials'])->orderBy('id','DESC')->paginate($itemsPerPage);
        return new CourseCollection($courses);
    }

    public function employeeSchedules(Request $request)
    {
        $emp = auth()->user()->userable;
        $start_date = $request->start_date;
        $end_date = $request->end_date;
        $schedules = CourseSchedule::with(['course'])->where('employee_id',$emp->id)->whereBetween('date',[$start_date, $end_date])->get();
        return new CourseScheduleCollection($schedules);
    }

    public function employeeScheduleAdd(Request $request, Course $course)
    {
        if (auth()->user()->role_id == 3 || auth()->user()->role_id == 4){
            return response()->json(['message' => 'You are not authorized for that', 'status' => 'error'],404);
        }
        $data = Validator::make($request->all(),[
            'date'=>'required|date',
            'start_time'=>'required',
            'end_time'=>'required',
            'classes'=>'required',
            'course_name'=>'required',
            'day'=>'required',
        ])->validate();
        $employee = auth()->user()->userable;
        /*$cc = $employee->courseEmployees()->where('courses.id',$course->id)->first();
        if (!isset($cc->id)) return response()->json(['message' => 'You are not authorized for this course', 'status' => 'error'],404);
        */
        $chk = $employee->employeeScheudles()
            ->where(['date'=>$data['date'],'status'=>0,'is_active'=>1])
            ->where('start_time','!=',null)
            ->where('start_time','<=',$data['start_time'])
            ->where('end_time','>=',$data['end_time'])->first();
        if (isset($chk->id)) return response()->json(['message' => 'You have another class on this time choice other time', 'status' => 'error'],404);

        $data +=[
            'course_id'=>$course->id,
            'employee_id'=>$employee->id,
        ];
        CourseSchedule::create($data);
        $this->adminNotify('Added new schedule',"Instructor added new schedule for $course->name",'admin-notify-channel-','/admin/course/course');
        return response()->json(['message' => 'Added Successfully', 'status' => 'success'],200);
    }
    public function getEmployeeCourses()
    {
        $emp = auth()->user()->userable;
        $course_ids = $emp->courseEmployees()->pluck('courses.id');
        $courses=Course::whereIn('id',$course_ids)->get(['id','name']);
        return new CourseCollection($courses);
    }

    /*
     * course schedule status change
     * */
    public function statusChange(Request $request, CourseSchedule $courseSchedule, $status)
    {

        try {
            if ($status == 2){
                //return $request->all();
                //$courseSchedule->courseScheduleCancel()->create();
                $data = [
                    'reason'=>$request->reason,
                    'course_schedule_id'=>$courseSchedule->id,
                    'created_by'=>auth()->id(),
                ];
                if ($request->input('employee_id') && $request->employee_id != null) $data+=['employee_id'=>$request->employee_id];
                CourseScheduleCancel::create($data);
                $this->adminNotify('Request for cancel schedule',"Instructor request for cancel schedule",'admin-notify-channel-','/admin/course/scheduleCancelRequest');
                return response()->json(['status'=>'success','message'=>'Request sent to admin please wait for admin approval'],200);
            }else{
                if ($courseSchedule->date > Carbon::today()) return response()->json(['status'=>'success','message'=>'You can\'t complete advance class'],404);
                $courseSchedule->update(['status' => $status]);
                $this->employeeNewWorkAdd($courseSchedule);
                return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
            }
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 404);
        }
    }

}
