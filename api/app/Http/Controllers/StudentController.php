<?php

namespace App\Http\Controllers;

use App\Http\Requests\StudentStoreRequest;
use App\Http\Requests\StudentUpdateRequest;
use App\Http\Resources\StudentCollection;
use App\Http\Resources\StudentCourseCollection;
use App\Http\Resources\StudentResource;
use App\Models\Parents;
use App\Models\Student;
use App\Models\StudentCourse;
use App\Models\User;
use App\Traits\FileUploadTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    use FileUploadTrait, ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\StudentCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $students = Student::query();
        if ($search) {
            $students->whereLike(['student_id','userable.first_name','userable.last_name','userable.email','userable.phone_number'], $search);
        }
        $courses = $students->with([
            'userable','userable.gender','userable.bloodGroup',
            'userable.religion','parents.userable'
        ])->orderBy('id','DESC')->paginate($itemsPerPage);
        return new StudentCollection($courses);
    }

    public function studentCourses(Request $request, Student $student)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $studentCourses = StudentCourse::query();
        $studentCourses->where('student_id',$student->id);
        if ($search) $studentCourses->whereLike(['course.name','course.amount'], $search);;
        $studentCourses = $studentCourses->with(['course'])->paginate($itemsPerPage);
        return new StudentCourseCollection($studentCourses);
    }

    /**
     * @param \App\Http\Requests\StudentStoreRequest $request
     *
     */
    public function store(StudentStoreRequest $request)
    {
        $user_data= $request->only(['first_name', 'last_name','email','phone_number','gender_id','blood_group_id','religion_id']);
        $student_data = $request->only([ 'roll_no', 'date_of_birth']);
        //parent email validate
        if (!$request->input('parent_id')) {
            Validator::make($request->all(), [
                'guardian_email' => ['nullable', 'email', 'max:60', 'unique:users,email'],
            ])->validate();
        }
        DB::beginTransaction();
        try {
            /*
             *existing student id find
             * */
            $check = DB::table('students')->where('student_id', '!=', null)->latest('id')->first(['id','student_id']);
            if (isset($check->id)){
                $student_id = $check->student_id + 1;
            }else{
                $student_id = date('Y') . '0001';//generate student id
            }
            while (1){
                $emp = Student::where(['student_id'=>$student_id])->where('student_id', '!=', null)->latest('id')->first();
                if(!isset($emp->id)) break;
                else{
                    $student_id = $emp->student_id + 1;
                }
            }
            $student_data +=['student_id'=>$student_id];
            if (!$request->input('parent_id')){
                $parent_data = $request->only(['father_name',
                    'father_profession',
                    'father_phone_no',
                    'father_nid',
                    'mother_name',
                    'mother_profession',
                    'mother_phone_number',
                    'mother_nid',
                    'present_address',
                    'parmanent_address',
                    'local_guardian_name',
                    'local_guardian_phone',
                    'relation',
                    'address']);
                $age = Carbon::parse($request->date_of_birth)->diff(Carbon::now())->format('%y');

                $parent = Parents::create($parent_data);
                $student_data +=['parent_id'=>$parent->id];
                if ($age < 18){
                    $parent_user=[
                        'first_name'=>'Parent',
                        'email'=>$request->guardian_email,
                        'password'=>Hash::make($student_id),
                        'role_id'=>4,//role 4 for student
                    ];
                    $parent->userable()->create($parent_user);
                }
            }else{
                $parent = Parents::find($request->input('parent_id'));
                $student_data +=['parent_id'=>$parent->id];
            }

            $student = Student::create($student_data);

            if ($request->file('image')){
                try {
                    $img = $this->uploadPhoto($request->file('image'),'student/');
                    $user_data +=[
                        'image'=>$img,
                    ];
                }catch (\Exception $e){
                    //
                }
            }
            $user_data +=[
                'password'=>Hash::make($student_id),
                'role_id'=>3,//role 3 for student
            ];
            $student->userable()->create($user_data);
            DB::commit();

            return new StudentResource($student->load(['userable','userable.gender','userable.bloodGroup',
                'userable.religion','parents.userable',]));
        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['status'=>'error','message'=>'Invalid request'],404);
        }

    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Student $student
     * @return \App\Http\Resources\StudentResource
     */
    public function show(Request $request, Student $student)
    {
        return new StudentResource($student->load(['userable','userable.role','userable.gender','userable.bloodGroup',
            'userable.religion','parents.userable']));
    }

    /**
     * @param \App\Http\Requests\StudentUpdateRequest $request
     * @param \App\Models\Student $student
     */
    public function update(StudentUpdateRequest $request, Student $student)
    {
        $user = $student->userable;
        //return $user->id;
        Validator::make($request->all(),[
            'email' => ['required','email','max:191','unique:users,email,'.$user->id],
        ])->validate();
        $user_data= $request->only(['first_name', 'last_name','email','phone_number','gender_id','blood_group_id','religion_id']);
        $student_data = $request->only([ 'roll_no', 'date_of_birth']);
        $parent_data = $request->only(['father_name',
            'father_profession',
            'father_phone_no',
            'father_nid',
            'mother_name',
            'mother_profession',
            'mother_phone_number',
            'mother_nid',
            'present_address',
            'parmanent_address',
            'local_guardian_name',
            'local_guardian_phone',
            'relation',
            'address']);
        DB::beginTransaction();
        try {
            $age = Carbon::parse($request->date_of_birth)->diff(Carbon::now())->format('%y');
            if ($age < 18) {
                $g_user = User::where(['userable_type'=>'App\Models\Parents','userable_id'=>$student->parent_id])->first();
                if (isset($g_user->id)){
                    Validator::make($request->all(),[
                        'guardian_email' => ['required','email','max:60','unique:users,email,'.$g_user->id],
                    ])->validate();
                    $g_user->update(['email'=>$request->guardian_email]);
                }else{
                    Validator::make($request->all(),[
                        'guardian_email' => ['required','email','max:60','unique:users,email'],
                    ])->validate();
                    $parent_user=[
                        'first_name'=>'Parent',
                        'userable_type'=>'App\Models\Parents',
                        'userable_id'=>$student->parent_id,
                        'email'=>$request->guardian_email,
                        'password'=>Hash::make(rand(111111,9999999)),
                        'role_id'=>4,//role 4 for student
                    ];
                    User::create($parent_user);
                }
                $student->parents()->update($parent_data);
            }
            $student->update($student_data);
            if ($request->file('image')){
                try {
                    $img = $this->uploadPhoto($request->file('image'),'student/');
                    $user_data +=[
                        'image'=>$img,
                    ];
                }catch (\Exception $e){
                    //
                }
            }
            $user->update($user_data);
            DB::commit();
            return new StudentResource($student->load(['userable','userable.gender','userable.bloodGroup',
                'userable.religion','parents.userable',]));
        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['status'=>'error','message'=>'invalid request try again'],404);
        }
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Student $student
     * @return JsonResponse
     */
    public function destroy(Request $request, Student $student)
    {
        if ($student->studentCourses()->count()) return response()->json(['status'=>'error','message'=>'You can\'t remove this student because already have one or more course'],404);
        try {
            $student->parents()->delete();
            $student->userable()->delete();
            $student->delete();
        }catch (\Exception $e){
            return response()->json(['status'=>'success','message'=>'Something went wrong'],404);
        }
        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(Student $student): JsonResponse
    {
        try {
            $student->update(['is_active' => !$student->is_active]);
            $student->userable()->update(['is_active' => $student->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }

    public function export(Request $request)
    {
        $cols = ['userable.name','userable.phone_number','userable.email', 'student_id','image','date_of_birth','created_at'];
        $headers = ['Name','Phone Number','Email', 'Student ID','Image', 'date_of_birth','Created At'];
        return $this->commonDataExporter('Student', $cols, $headers);
    }
}
