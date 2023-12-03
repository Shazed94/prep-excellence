<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseTypeCollection;
use App\Http\Resources\EmployeeCollection;
use App\Http\Resources\UserResource;
use App\Models\CourseType;
use App\Models\Employee;
use App\Models\User;
use App\Traits\SatTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CommonController extends Controller
{
    use SatTrait;

    /*
     * sat questionQualities get
     * */
    public function question_Qualities()
    {
        return response()->json($this->questionQualities(),200);
    }

    /*
     * sat all keys
     * */
    public function allKeys()
    {
        return response()->json($this->all_keys(),200);
    }

    /*
     * sat  keys
     * */
    public function satKey()
    {
        return response()->json($this->sat_keys(),200);
    }

    /*
     * sat  subScores
     * */
    public function sub_scores()
    {
        return response()->json($this->subScores(),200);
    }

    /*
     * sat  crossTestScore
     * */
    public function cross_testScore()
    {
        return response()->json($this->crossTestScore(),200);
    }

    /*
     * sat  crossTestScore
     * */
    public function sat_exams()
    {
        return response()->json($this->satExams(),200);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\EmployeeCollection
     */
    public function getAllEmployees(Request $request)
    {
        //return Cache::remember('employee_all',now()->addHours(3), function() {
            $employees =  Employee::where('id','!=',1)->with([
                'userable'=>function($q){$q->select('id','first_name','last_name','phone_number','image','userable_type','userable_id'); }
            ])->get(['id','employee_id']);
            return new EmployeeCollection($employees);
        //});
    }

    public function getAllAuthors(Request $request)
    {
        $user = User::where('userable_type','App\Models\Employee')->get();
        return UserResource::collection($user);
    }

    public function ckImageUpload(Request $request)
    {
        $img = null;
        if ($request->file('upload')){
            $img = $this->uploadPhoto($request->file('upload'),'ckeditor/');
        }
        return response()->json(['url'=>asset($img)],200);
    }

    public function courseTypes(Request $request)
    {
        $course_types = CourseType::all();
        return new CourseTypeCollection($course_types);
    }

}
