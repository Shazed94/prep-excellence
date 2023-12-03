<?php

namespace App\Http\Controllers;

use App\Http\Requests\StudentCourseStoreRequest;
use App\Http\Requests\StudentCourseUpdateRequest;
use App\Http\Resources\StudentCourseCollection;
use App\Http\Resources\StudentCourseResource;
use App\Models\Student;
use App\Models\StudentCourse;
use App\Traits\CommonTrait;
use App\Traits\EmailTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentCourseController extends Controller
{
    use EmailTrait, CommonTrait, ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\StudentCourseCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $studentCourses = StudentCourse::query();
        //$studentCourses->where('payment_status','paid');
        if ($search) {
            $studentCourses->whereLike(['student.student_id','transaction_no','payment_type','course.name'], $search);
        }
        $studentCourses = $studentCourses->with([
            'student','student.userable','course'
        ])->orderBy('id','DESC')->paginate($itemsPerPage);
        return new StudentCourseCollection($studentCourses);
    }

    /**
     * @param \App\Http\Requests\StudentCourseStoreRequest $request
     * @return \App\Http\Resources\StudentCourseResource
     */
    public function store(StudentCourseStoreRequest $request)
    {
        $tnx_id = uniqid();
        $data = $request->validated();
        $data +=['transaction_no'=> $tnx_id];
        $data +=['payment_status'=> 'paid'];
        $data +=['is_approved'=> 1];
        $studentCourse = StudentCourse::create($data);
        //email sent
        try {
            $this->confirmOrder($studentCourse,"New Order #$tnx_id -".env('APP_NAME'));
        }catch (\Exception $e){
            //
        }
        return new StudentCourseResource($studentCourse->load(['student','student.userable','course']));
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\StudentCourse $studentCourse
     * @return \App\Http\Resources\StudentCourseResource
     */
    public function show(Request $request, StudentCourse $studentCourse)
    {
        return new StudentCourseResource($studentCourse);
    }

    /**
     * @param \App\Http\Requests\StudentCourseUpdateRequest $request
     * @param \App\Models\StudentCourse $studentCourse
     * @return \App\Http\Resources\StudentCourseResource
     */
    public function update(StudentCourseUpdateRequest $request, StudentCourse $studentCourse)
    {
        $studentCourse->update($request->validated());
        try {
            $user = $this->findUserById(Student::find($studentCourse->student_id));
            $message = "Your course/payment is updated. Course total cost $studentCourse->amount payment type $studentCourse->payment_type and payment details is $studentCourse->payment_details";
            $this->defaultEmail($user->name,$user->email,'Your payment/course updated',$message);
        }catch (\Exception $e){
            //
        }
        return new StudentCourseResource($studentCourse->load(['student','student.userable','course']));
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\StudentCourse $studentCourse
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, StudentCourse $studentCourse)
    {
        $studentCourse->delete();

        return response()->noContent();
    }
    public function toggle(StudentCourse $studentCourse): JsonResponse
    {
        try {
            $studentCourse->update(['is_active' => !$studentCourse->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
    public function approveOrDecline(StudentCourse $studentCourse): JsonResponse
    {
        try {
            $studentCourse->update(['is_approved' => !$studentCourse->is_approved]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
    public function export(Request $request)
    {
        $cols = ['course.name', 'student.student_id','amount','payment_status','payment_type','transaction_no','payment_details','createdBy.name'];
        $headers = ['Name', 'Student ID','amount', 'payment_status','payment_type','transaction_no','payment_details','Created By'];
        return $this->commonDataExporter('StudentCourse', $cols, $headers);

    }
}
