<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Requests\EmployeeOverTimeStoreRequest;
use App\Http\Requests\EmployeeOverTimeUpdateRequest;
use App\Http\Resources\EmployeeOverTimeCollection;
use App\Http\Resources\EmployeeOverTimeResource;
use App\Models\EmployeeOverTime;
use App\Traits\PushNotificationTrait;
use Illuminate\Http\Request;

class EmployeeOverTimeController extends Controller
{
    use PushNotificationTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\EmployeeOverTimeCollection
     */
    public function index(Request $request)
    {
        //return response()->json(['hello']);
        $emp = auth()->user()->userable;
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $employeeOverTimes = EmployeeOverTime::query();
        $employeeOverTimes->where('employee_id',$emp->id);
        if ($search) {
            $employeeOverTimes->whereLike(['date','working_hour','hour_rate','work_type','note','course.name'], $search);
        }
        $employeeOverTimes = $employeeOverTimes->with('course')->paginate($itemsPerPage);
        return new EmployeeOverTimeCollection($employeeOverTimes);
    }

    /**
     * @param \App\Http\Requests\EmployeeOverTimeStoreRequest $request
     * @return \App\Http\Resources\EmployeeOverTimeResource
     */
    public function store(EmployeeOverTimeStoreRequest $request)
    {
        $emp = auth()->user()->userable;
        $data = $request->validated();
        $data +=['employee_id'=>$emp->id,'status'=>0,'is_paid'=>0];
        $employeeOverTime = EmployeeOverTime::create($data);
        $this->adminNotify('Request for overtime',"Instructor request for overtime",'admin-notify-channel-','/admin/billing/overTime');

        return new EmployeeOverTimeResource($employeeOverTime->load('course'));
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\EmployeeOverTime $employeeOverTime
     * @return \App\Http\Resources\EmployeeOverTimeResource
     */
    public function show(Request $request, EmployeeOverTime $employeeOverTime)
    {
        return new EmployeeOverTimeResource($employeeOverTime->load('course'));
    }

    /**
     * @param \App\Http\Requests\EmployeeOverTimeUpdateRequest $request
     * @param \App\Models\EmployeeOverTime $employeeOverTime
     * @return \App\Http\Resources\EmployeeOverTimeResource
     */
    public function update(EmployeeOverTimeUpdateRequest $request, EmployeeOverTime $employeeOverTime)
    {
        $employeeOverTime->update($request->validated());

        return new EmployeeOverTimeResource($employeeOverTime->load('course'));
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\EmployeeOverTime $employeeOverTime
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, EmployeeOverTime $employeeOverTime)
    {
        if($employeeOverTime->is_paid == 0 && $employeeOverTime->status == 0) $employeeOverTime->delete();
        return response()->noContent();
    }
}
