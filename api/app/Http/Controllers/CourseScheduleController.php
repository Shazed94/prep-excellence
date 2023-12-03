<?php

namespace App\Http\Controllers;

use App\Http\Requests\CourseScheduleStoreRequest;
use App\Http\Requests\CourseScheduleUpdateRequest;
use App\Http\Resources\CourseScheduleCollection;
use App\Http\Resources\CourseScheduleResource;
use App\Models\Course;
use App\Models\CourseSchedule;
use App\Models\CourseScheduleCancel;
use App\Models\Email;
use App\Traits\CommonTrait;
use App\Traits\CourseTrait;
use App\Traits\PushNotificationTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseScheduleController extends Controller
{
    use CourseTrait, PushNotificationTrait,CommonTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\CourseScheduleCollection
     */
    public function index(Request $request)
    {
        $courseSchedules = CourseSchedule::all();

        return new CourseScheduleCollection($courseSchedules);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\CourseScheduleCollection
     */
    /*
     * course schedule by employee ids and date ranges
     * */
    public function courseSchedules(Request $request)
    {
        $data = Validator::make($request->all(),[
            'start_date'=>'required|date',
            'end_date'=>'required|date',
            'employee_ids'=>'required|exists:employees,id',
        ])->validate();
        $courseSchedules = CourseSchedule::query();
        $courseSchedules->whereBetween('date',[$data['start_date'],$data['end_date']]);
        $courseSchedules->whereIn('employee_id',$data['employee_ids']);

        return new CourseScheduleCollection($courseSchedules->get());
    }

    public function addClassLink(Request $request, CourseSchedule $courseSchedule)
    {
        Validator::make($request->all(),[
            'class_link'=>'required'
        ])->validate();
        $courseSchedule->update(['class_link'=>$request->class_link]);
        return response()->json(['status'=>'success','message'=>"Successfully update class link"],200);
    }

    /**
     * @param \App\Http\Requests\CourseScheduleStoreRequest $request
     * @return \App\Http\Resources\CourseScheduleResource
     */
    public function store(CourseScheduleStoreRequest $request)
    {
        $data = $request->validated();
        $data += $this->storeMetadata($request);
        $courseSchedule = CourseSchedule::create($data);

        return new CourseScheduleResource($courseSchedule);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\CourseSchedule $courseSchedule
     * @return \App\Http\Resources\CourseScheduleResource
     */
    public function show(Request $request, CourseSchedule $courseSchedule)
    {
        return new CourseScheduleResource($courseSchedule);
    }

    /**
     * @param \App\Http\Requests\CourseScheduleUpdateRequest $request
     * @param \App\Models\CourseSchedule $courseSchedule
     * @return \App\Http\Resources\CourseScheduleResource
     */
    public function update(CourseScheduleUpdateRequest $request, CourseSchedule $courseSchedule)
    {
        $prev_data = $courseSchedule;
        $data = $request->validated();
        $data += $this->updateMetadata($request);
        $courseSchedule->update($data);

        if ($prev_data->employee_id != $courseSchedule->employee_id){
            $this->employeeNotifyById([$data['employee_id']],'New Class Assigned','You have a new class on '.$courseSchedule->date,'/employee/course');
        }else{
            $this->employeeNotifyById([$data['employee_id']],'Class details updated','Your class details updated ','/employee/course');
        }

        return new CourseScheduleResource($courseSchedule);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\CourseSchedule $courseSchedule
     *
     */
    public function destroy(Request $request, CourseSchedule $courseSchedule)
    {
        if ($courseSchedule->status != 0) return response()->json(['status'=>'error','message'=>'You can\'t remove this'],404);
        $courseSchedule->delete();

        return response()->noContent();
    }

    public function scheduleCancelRequest(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $cancel_request = CourseScheduleCancel::query();
        if ($search) {
            $cancel_request->whereLike(['reason','note'], $search);
        }
        $cancel_request = $cancel_request->with([
            'user'=>function($q){$q->select('id','first_name','last_name','phone_number');},
            'employee.userable',
            'courseSchedule.course'
        ])->orderBy('id','DESC')->paginate($itemsPerPage);
        return response()->json($cancel_request,200);
    }

    public function scheduleCancelOrApprove(Request $request, CourseScheduleCancel $courseScheduleCancel)
    {
        $data = Validator::make($request->all(),[
            'employee_id'=>'nullable|exists:employees,id',
            'note'=>'nullable',
            'status'=>'required'
        ])->validate();
        if ($request->status == 1){
            $course_schedule = $courseScheduleCancel->courseSchedule;
            $courseScheduleCancel->update(['employee_id'=>$request->employee_id, 'note'=>$request->note,'status'=>1]);
            if(!$request->employee_id) {
                $course_schedule->update(['status' => 2]);
                $this->notifyPush($courseScheduleCancel->created_by);
            }else {
                $course_schedule->update(['employee_id' => $request->employee_id]);
                $course = $course_schedule->course;
                $ids = $this->getEmployeeIdsByCourse($course);
                if (!in_array($data['employee_id'],$ids)){
                    $course->employees()->attach([$data['employee_id']]);
                }
                $this->notifyPush($courseScheduleCancel->created_by);
                $this->employeeNotifyById([$data['employee_id']],'New Class Assigned','You have a new class on '.$course_schedule->date,'/employee/course');
            }
        }else{
            $courseScheduleCancel->update(['note'=>$request->note,'status'=>2]);
            $nn=[
                'user_id'=>$courseScheduleCancel->created_by,
                'subject'=>'Canceled Request',
                'message'=>'You cancel class request is canceled',
                'link'=>'/employee/course',
                'channel_name'=>'user-channel-'.$courseScheduleCancel->created_by,
            ];
            $this->storePushNotification($nn);
        }
        //if cancel notify student and parents
        try {
            if (isset($data['status']) && $data['status'] == 1 && !isset($data['employee_id'])){
                $schedule = $courseScheduleCancel->courseSchedule;
                $course = Course::find($schedule->course_id);
                $emails = $this->getStudentAndParentEmail($course);
                $data=[];
                foreach ($emails as $email){
                    $data[]=[
                        'name'=>'',
                        'email'=>$email,
                        'subject'=>'Schedule cancel alert',
                        'message'=>"$course->name class schedule is canceled due to instructor request.
                         Schedule was $schedule->date and $schedule->start_time to $schedule->end_time",
                        'try'=>0,
                        'is_sent'=>0,
                        'created_at'=> now(),
                        'updated_at'=> now(),
                    ];
                }
                Email::insert($data);
            }
        }catch (\Exception $e){
            //
        }

        return response()->json(['status'=>'success','message'=>'Successfully updated'],200);
    }
    private function notifyPush($user_id){
        $nn=[
            'user_id'=>$user_id,
            'subject'=>'Approved',
            'message'=>'You cancel class request is approve',
            'link'=>'/employee/course',
            'channel_name'=>'user-channel-'.$user_id,
        ];
        $this->storePushNotification($nn);
    }
}
