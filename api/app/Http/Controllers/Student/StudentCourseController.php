<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseCollection;
use App\Http\Resources\CourseMaterialCollection;
use App\Http\Resources\CourseScheduleCollection;
use App\Http\Resources\ExamCollection;
use App\Http\Resources\HomeWorkCollection;
use App\Http\Resources\OrderCollection;
use App\Http\Resources\StudentCourseCollection;
use App\Models\Complain;
use App\Models\Course;
use App\Models\CourseMaterial;
use App\Models\CourseSchedule;
use App\Models\Exam;
use App\Models\HomeWork;
use App\Models\Order;
use App\Models\StudentCourse;
use App\Models\StudentHomeWork;
use App\Traits\CommonTrait;
use App\Traits\FileUploadTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;

class StudentCourseController extends Controller
{
    use FileUploadTrait, CommonTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\StudentCourseCollection
     */
    public function index(Request $request)
    {
        $ids = $this->findStudentIds();
        //return $ids;
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $studentCourses = StudentCourse::query();
        if(!$request->input('payment_history')) $studentCourses->where('is_approved',1);
        $studentCourses->where('is_active',1);
        if ($search) {
            $studentCourses->whereLike(['transaction_no','payment_type'], $search);
        }
        $studentCourses = $studentCourses->whereIn('student_id',$ids)->with([
            'course.courseSchedules',
            'course.employees.userable',
            'student.userable',
            //'course.attendanceStudents'=>function($q) use ($ids) {$q->with(['attendanceStatus'])->whereIn('student_id',$ids)->get();},

        ])->paginate($itemsPerPage);
        return new StudentCourseCollection($studentCourses);
    }

    public function studentSchedules(Request $request)
    {
        $ids = $this->findStudentIds();
        //$std = auth()->user()->userable;
        $course_ids =StudentCourse::whereIn('student_id',$ids)->where(['is_approved'=>1,'is_active'=>1])->pluck('course_id');
        //$std->studentCourses()->pluck('course_id');
        $start_date = $request->start_date;
        $end_date = $request->end_date;
        $schedules = CourseSchedule::with(['course','employee.userable'])->whereIn('course_id',$course_ids)->whereBetween('date',[$start_date, $end_date])->get();
        return new CourseScheduleCollection($schedules);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @return CourseMaterialCollection
     */
    public function courseMaterials(Request $request)
    {
        $ids = $this->findStudentIds();
        //$std= auth()->user()->userable;
        $course_ids = StudentCourse::whereIn('student_id',$ids)->where(['is_approved'=>1,'is_active'=>1])->pluck('course_id');
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $materials = CourseMaterial::query();
        $materials->whereIn('course_id',$course_ids);
        $materials->whereDate('expire_date','>=',Carbon::today());
        if ($search) {
            $materials->whereLike(['course.name','course.batch'], $search);
        }
        $materials=$materials->with(['course'])->orderBy('id','DESC')->paginate($itemsPerPage);
        return new CourseMaterialCollection($materials);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @return HomeWorkCollection
     */
    public function homeWorks(Request $request)
    {
        $ids = $this->findStudentIds();
        //$std = auth()->user()->userable;
        $course_ids = StudentCourse::whereIn('student_id',$ids)->where(['is_approved'=>1,'is_active'=>1])->pluck('course_id');
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $materials = HomeWork::query();
        $materials->whereIn('course_id',$course_ids);
        if ($search) {
            $materials->whereLike(['course.name','course.batch','submission_last_date'], $search);
        }
        $materials=$materials->with(['course',
            'studentHomeWorks'=>function($q) use ($ids) { $q->whereIn('student_id',$ids);}
        ])->orderBy('id','DESC')->paginate($itemsPerPage);
        return new HomeWorkCollection($materials);
    }

    public function homeWorkSubmit(HomeWork $homeWork, Request $request)
    {
        Validator::make($request->all(),[
            'file'=>'required',
        ])->validate();
        $std = auth()->user()->userable;
        $data =[
            'student_id'=>$std->id,
            'home_work_id'=>$homeWork->id,
            'total_mark'=>$homeWork->total_mark,
            'submission_type'=>$homeWork->last_date > Carbon::now() ? 'On Time':'Late Submit',
            'is_active'=>1
        ];
        if ($request->file('file')){
            $img = $this->uploadFile($request->file('file'),'courseMaterial');
            $data +=[
                'file'=>$img,
            ];
        }
        $homeWork->studentHomeWorks()->where('student_id',$std->id)->delete();
        StudentHomeWork::create($data);
        return response()->json(['status'=>'success','message'=>'Successfully submitted'],200);
    }
    /*
     * method for student attendances
     * */
    public function attendances(Request $request)
    {
        $ids = $this->findStudentIds();
        //$std = auth()->user()->userable;
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $course_ids = StudentCourse::whereIn('student_id',$ids)->where(['is_approved'=>1,'is_active'=>1])->pluck('course_id');
        $course = Course::query();
        $course->whereIn('id',$course_ids);
        if ($search) {
            $course->whereLike(['name','batch'], $search);
        }
        $course = $course->with([
            'attendanceStudents'=>function($q) use ($ids) {$q->with(['attendanceStatus'])->whereIn('student_id',$ids)->get();},
        ])->paginate($itemsPerPage);
        return new CourseCollection($course);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\ExamCollection
     */
    public function exams(Request $request)
    {
        $ids = $this->findStudentIds();
        //$std = auth()->user()->userable;
        $course_ids = StudentCourse::whereIn('student_id',$ids)->where(['is_approved'=>1,'is_active'=>1])->pluck('course_id');
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $exams = Exam::query();
        $exams->where('status',1);
        $exams->whereHas('examQuestions',null,'>=',1);
        $exams->whereIn('course_id',$course_ids);
        if ($search) {
            $exams->whereLike(['title','exam_start','exam_end','duration','course.name','course.batch'], $search);
        }
        $exams = $exams->with(['course'])->withCount([
            'studentAnswers'=>function($q) use ($ids) {$q->whereIn('student_id',$ids);}
        ])->orderBy('id','DESC')->paginate($itemsPerPage);
        return new ExamCollection($exams);
    }

    public function dashbaord(Request $request)
    {
        $ids = $this->findStudentIds();
        $s_courses = StudentCourse::whereIn('student_id',$ids)->where(['is_active'=>1])->get();
        $data=[
            'total_enrolled'=> $s_courses->where('is_approved',1)->count(),
            'unpaid_order'=> Order::where(['payment_status'=>'Unpaid','user_id'=>auth()->id()])->count(),
            'total_completed'=> Course::whereIn('id',$s_courses->where('is_approved',1)->pluck('course_id')->toArray())->whereDate('end_date','<',Carbon::today())->count(),
            'home_work'=> HomeWork::whereIn('course_id',$s_courses->where('is_approved',1)->pluck('course_id')->toArray())->count(),
            'course_material'=> CourseMaterial::whereIn('course_id',$s_courses->where('is_approved',1)->pluck('course_id')->toArray())->where('is_active',1)->count(),
            'exams'=> Exam::whereHas('examQuestions',null,'>=',1)->whereIn('course_id',$s_courses->where('is_approved',1)->pluck('course_id')->toArray())->where('status',1)->count(),
            'payments'=> Order::where('user_id',auth()->id())->count(),
            'complain'=> Complain::where('user_id',auth()->id())->count(),
        ];

        return response()->json(['data'=>$data],200);
    }

    public function orders(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $orders = Order::query();
        $orders->where('user_id',auth()->id());
        if ($search) {
            $orders->whereLike(['id','payment_method','product_total','orderPayment.txn_number'], $search);
        }
        $orders = $orders->with([
            'orderPayment','studentCourses.course'
        ])->orderBy('id','DESC')->paginate($itemsPerPage);
        return new OrderCollection($orders);
    }
}
