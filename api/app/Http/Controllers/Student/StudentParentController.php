<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseCollection;
use App\Http\Resources\CourseMaterialCollection;
use App\Http\Resources\CourseScheduleCollection;
use App\Http\Resources\CourseScheduleResource;
use App\Http\Resources\ExamCollection;
use App\Http\Resources\ExamResource;
use App\Http\Resources\HomeWorkCollection;
use App\Http\Resources\StudentCourseCollection;
use App\Models\Complain;
use App\Models\Course;
use App\Models\CourseMaterial;
use App\Models\CourseSchedule;
use App\Models\Exam;
use App\Models\HomeWork;
use App\Models\Student;
use App\Models\StudentCourse;
use App\Models\StudentHomeWork;
use App\Traits\CommonTrait;
use App\Traits\FileUploadTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class StudentParentController extends Controller
{
    use FileUploadTrait, CommonTrait;

    public function exam(Request $request)
    {
        $ids = $this->findStudentIds();
        $student_id = $request->input('student_id');
        if(!in_array($student_id,$ids)){
            return  response()->json([],200);
        }
        //$std = auth()->user()->userable;
        $course_ids = StudentCourse::where('student_id',$student_id)->where(['is_approved'=>1,'is_active'=>1])->pluck('course_id');
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $exams = Exam::query();
        $exams->where('status',1);
        $exams->whereIn('course_id',$course_ids);
        if ($search) {
            $exams->whereLike(['title','exam_start','exam_end','duration','course.name'], $search);
        }
        $exams = $exams->withCount(['studentAnswers'])->with(['course'])->orderBy('id','DESC')->paginate($itemsPerPage);
        //return new ExamCollection($exams);
        return response()->json($exams,200);
    }
    public function studentExam(Request $request, Exam $exam)
    {
        $ids = $this->findStudentIds();
        $student_id = $request->input('student_id');
        if(!in_array($student_id,$ids)){
            return  response()->json([],200);
        }
        $exam = $exam->with([
            'course',
            'satSection.satScores',
            'studentAnswers'=>function($q) use ($student_id) {$q->where('student_id',$student_id)->orderBy('exam_question_id','ASC');},
        ])->where('id',$exam->id)->first();
        return new ExamResource($exam);

    }
    /*
     * methods for get child information
     * */
    public function childInfos(Request $request)
    {
        $ids = $this->findChildIds();
        $student = Student::whereIn('id',$ids)->with([
            'userable'=>function($q){$q->select(['id','role_id',
                'userable_type',
                'userable_id',
                'first_name',
                'last_name',
                'email',
                'phone_number',
                'image',
                'gender_id']);}
        ])->get(['id','student_id']);
        return response()->json(['data'=>$student]);
    }


}
