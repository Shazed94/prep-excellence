<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeOverTimeStoreRequest;
use App\Http\Requests\EmployeeOverTimeUpdateRequest;
use App\Http\Resources\EmployeeOverTimeCollection;
use App\Http\Resources\EmployeeOverTimeResource;
use App\Models\Employee;
use App\Models\EmployeeOverTime;
use App\Traits\PushNotificationTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\Request;

class EmployeeOverTimeController extends Controller
{
    use ReportTrait, PushNotificationTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\EmployeeOverTimeCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $employeeOverTimes = EmployeeOverTime::query();
        /*if ($search) {
            $employeeOverTimes->whereLike(['title','description'], $search);
        }*/
        $employeeOverTimes = $employeeOverTimes->with([
            'employee'=>function($q){$q->select('id','employee_id'); },
            'employee.userable'=>function($q){$q->select('id','userable_id','userable_type','first_name','last_name','email','phone_number'); },
        ])->paginate($itemsPerPage);
        return new EmployeeOverTimeCollection($employeeOverTimes);
    }

    /**
     * @param \App\Http\Requests\EmployeeOverTimeStoreRequest $request
     * @return \App\Http\Resources\EmployeeOverTimeResource
     */
    public function store(EmployeeOverTimeStoreRequest $request)
    {
        $employeeOverTime = EmployeeOverTime::create($request->validated());

        return new EmployeeOverTimeResource($employeeOverTime);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\EmployeeOverTime $employeeOverTime
     * @return \App\Http\Resources\EmployeeOverTimeResource
     */
    public function show(Request $request, EmployeeOverTime $employeeOverTime)
    {
        return new EmployeeOverTimeResource($employeeOverTime);
    }

    /**
     * @param \App\Http\Requests\EmployeeOverTimeUpdateRequest $request
     * @param \App\Models\EmployeeOverTime $employeeOverTime
     * @return \App\Http\Resources\EmployeeOverTimeResource
     */
    public function update(EmployeeOverTimeUpdateRequest $request, EmployeeOverTime $employeeOverTime)
    {
        $employeeOverTime->update($request->validated());
        if ($employeeOverTime->status == 1){
            $this->employeeNotifyById([$employeeOverTime->employee_id],'Approve Overtime','Your overtime request is approved','/employee/billing/overTime');
        }elseif ($employeeOverTime->status ==2){
            $this->employeeNotifyById([$employeeOverTime->employee_id],'Overtime request cancelled','Your overtime request cancelled by admin','/employee/billing/overTime');
        }
        return new EmployeeOverTimeResource($employeeOverTime);
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

    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\EmployeeOverTimeCollection
     */
    public function employeeOverTime(Request $request, Employee $employee)
    {

        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $employeeWorkings = EmployeeOverTime::query();
        $employeeWorkings->where('employee_id',$employee->id);
        $employeeWorkings->where('status',1);
        /*if ($search) {
            $employeeWorkings->whereLike(['title','description'], $search);
        }*/

        return new EmployeeOverTimeCollection($employeeWorkings->orderBy('id','DESC')->paginate($itemsPerPage));
    }
    public function export(Request $request)
    {
        $cols = ['invoice_no',
            'employee.employee_id',
            'date',
            'working_hour',
            'hour_rate',
            'work_type',
            'note',
            'status',
            'is_paid',];
        $total = ['working_hour'];
        $headers = ['Employee',
            'Date',
            'Working Hour',
            'Hour Rate',
            'Work Type',
            'Note',
            'status',
            'is paid',];
        return $this->commonDataExporter('EmployeeOverTime', $cols, $headers, $total);
    }
}
