<?php

namespace App\Http\Controllers;

use App\Http\Requests\CourseStoreRequest;
use App\Http\Requests\CourseUpdateRequest;
use App\Http\Resources\CourseCollection;
use App\Http\Resources\CourseResource;
use App\Http\Resources\CourseScheduleCollection;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseSchedule;
use App\Models\Employee;
use App\Traits\CommonTrait;
use App\Traits\FileUploadTrait;
use App\Traits\PushNotificationTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    use FileUploadTrait, CommonTrait, ReportTrait, PushNotificationTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\CourseCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $course_type_id = request('course_type_id');
        $category_id = request('category_id');
        $employee_id = request('instructor_id');
        $start_date = request('start_date');
        $end_date = request('end_date');
        $courses = Course::query();
        if ($search) {
            $courses->whereLike(['name','batch','amount'], $search);
        }
        if ($category_id) {
            try {
                $c_ids = CourseCategory::find($category_id)->courses()->pluck('courses.id');
                $courses->whereIn('id', $c_ids);
            }catch (\Exception $e){
                //
            }
        }
        if ($employee_id) {
            try {
                $c_ids = Employee::find($employee_id)->courseEmployees()->pluck('courses.id');
                //return $c_ids;
                $courses->whereIn('id', $c_ids);
            }catch (\Exception $e){
                //
            }
        }
        if ($course_type_id) {
            $courses->where('course_type_id', $course_type_id);
        }
        if ($start_date) {
            $courses->whereDate('start_date', '>=', $start_date);
        }
        if ($end_date) {
            $courses->whereDate('end_date', '<=', $end_date);
        }
        $courses = $courses->with([
            'courseType','courseSchedules',
            'employees','employees.userable','courseCategories'
        ])->withCount(['studentCourses'])->orderBy('id','DESC')->paginate($itemsPerPage);
        return new CourseCollection($courses);
    }

    /*
     * get all course name only
     * */
    public function onlyCourse()
    {
        $courses=Course::where('is_active',1)->get(['id','name']);
        return new CourseCollection($courses);
    }

    /**
     * @param \App\Http\Requests\CourseStoreRequest $request
     * @return \App\Http\Resources\CourseResource
     */
    public function store(CourseStoreRequest $request)
    {
        $data = $request->validated();
        $data += $this->commonFields($request);
        unset($data['image']);
        if ($request->file('image')){
            $img = $this->uploadPhoto($request->file('image'),'course/');
            $data +=[
                'image'=>$img,
                'is_active'=>1
            ];
        }
        $course = Course::create($data);

        $course->courseCategories()->sync($request->category_ids);
        $course->employees()->sync($request->employee_ids);
        $schedules = json_decode($request->course_schedules,true);
        $ss=[];
        foreach ($schedules as $se){
            $se['course_id']=$course->id;
            $ss[]=$se;
        }
        if (count($ss)) CourseSchedule::insert($ss);
        //employee notify
        $this->employeeNotifyById($request->employee_ids,'New Course Assigned','You have a new course','/employee/course');
        return new CourseResource($course->load([
            'courseType','courseSchedules',
            'employees','courseCategories'
        ]));
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Course $course
     * @return \App\Http\Resources\CourseResource
     */
    public function show(Request $request, Course $course)
    {
        return new CourseResource($course);
    }

    /**
     * @param \App\Http\Requests\CourseUpdateRequest $request
     * @param \App\Models\Course $course
     * @return \App\Http\Resources\CourseResource
     */
    public function update(CourseUpdateRequest $request, Course $course)
    {
        $data = $request->validated();
        unset($data['image']);
        if ($request->file('image')){
            $img = $this->uploadPhoto($request->file('image'),'course/');
            $data +=[
                'image'=>$img,
            ];
        }
        $course->update($data);
        $course->courseCategories()->sync($request->category_ids);
        /*$course->employees()->sync($request->employee_ids);
        $schedules = json_decode($request->course_schedules,true);
        $course->courseSchedules()->delete();
        $ss=[];
        foreach ($schedules as $se){
            unset($se['id']);
            $se['course_id']=$course->id;
            $ss[]=$se;
        }
        if (count($ss)) CourseSchedule::insert($ss);
        $this->employeeNotifyById($request->employee_ids,'New Course Assigned','You have a new course','/employee/course');
        */
        return new CourseResource($course->load([
            'courseType','courseSchedules',
            'employees','courseCategories'
        ]));
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Course $course
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Course $course)
    {
        $course->delete();

        return response()->noContent();
    }

    public function toggle(Course $course): JsonResponse
    {
        try {
            $course->update(['is_active' => !$course->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }

    public function schedules(Request $request)
    {
        $start_date = $request->start_date;
        $end_date = $request->end_date;
        $schedules = CourseSchedule::with(['course','employee.userable'])->whereBetween('date',[$start_date, $end_date])->get();
        return new CourseScheduleCollection($schedules);
    }

    /* method for additional schedule add*/
    public function additionalScheduleStore(Request $request, Course $course)
    {
        Validator::make($request->all(),[
            'end_date'=>'required|date',
            'duration_in_hour'=>'required',
            'duration_in_week'=>'required',
            'course_schedules'=>'required',
            'employee_ids'=>'required|exists:employees,id',
        ])->validate();
        $course->update(['end_date'=>$request->end_date, 'duration_in_hour'=>($request->duration_in_hour + $course->duration_in_hour),
            'duration_in_week'=>($request->duration_in_week + $course->duration_in_week)]);
        $course->employees()->sync($request->employee_ids);
        $schedules = json_decode($request->course_schedules,true);
        $ss=[];
        foreach ($schedules as $se){
            $se['course_id']=$course->id;
            $ss[]=$se;
        }
        if (count($ss)) CourseSchedule::insert($ss);
        $this->employeeNotifyById($request->employee_ids,'New Schedule','You have a new schedule','/employee/course');
        return response()->json(['status'=>'success', 'message'=>'Successfully added'],200);
    }

    public function export(Request $request)
    {
        $cols = ['name', 'batch','amount','start_date','end_date','duration_in_hour','duration_in_week','course_location','class_time','createdBy.name'];
        $headers = ['Name', 'Batch','Amount','Start Date','End Date','Duration(H)','Duration(W)','Course Location','Class Time','Created By'];
        return $this->commonDataExporter('Course', $cols, $headers);

    }
}
