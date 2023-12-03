<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeWorkingStoreRequest;
use App\Http\Requests\EmployeeWorkingUpdateRequest;
use App\Http\Resources\EmployeeCollection;
use App\Http\Resources\EmployeeResource;
use App\Http\Resources\EmployeeWorkingCollection;
use App\Http\Resources\EmployeeWorkingResource;
use App\Models\Employee;
use App\Models\EmployeeWorking;
use App\Traits\ReportTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmployeeWorkingController extends Controller
{
    use ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\EmployeeWorkingCollection
     */
    public function index(Request $request)
    {

        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $employeeWorkings = EmployeeWorking::query();
        /*if ($search) {
            $employeeWorkings->whereLike(['title','description'], $search);
        }*/

        return new EmployeeWorkingCollection($employeeWorkings->paginate($itemsPerPage));
    }
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\EmployeeWorkingCollection
     */
    public function employeeWorks(Request $request, Employee $employee)
    {

        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $employeeWorkings = EmployeeWorking::query();
        $employeeWorkings->where('employee_id',$employee->id);
        /*if ($search) {
            $employeeWorkings->whereLike(['title','description'], $search);
        }*/

        return new EmployeeWorkingCollection($employeeWorkings->orderBy('id','DESC')->paginate($itemsPerPage));
    }

    /*
     * method for employee wise hour and rate calculation
     * */
    public function index2(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $employees = Employee::query();
        if ($search) {
            $employees->whereLike(['employee_id','father_name','mother_name'], $search);
        }
        $employees = $employees->with([
            'userable'=>function($q){$q->select('id','userable_id','userable_type','first_name','last_name','email','phone_number'); },
            ])
            ->withSum('employeeWorkings as regular_hour','working_hour')
            ->withSum('employeeOverTimes as ot_hour','working_hour')
            ->withCount([
                'employeePayments AS paid_hour' => function ($query) {
                    $query->where('is_paid',1)->select(DB::raw("SUM(total_hour)"));
                },
                'employeePayments AS pending_hour' => function ($query) {
                    $query->where('is_paid',0)->select(DB::raw("SUM(total_hour)"));
                },
            ])
            ->paginate($itemsPerPage);
        //return (EmployeeResource::collection($employees))->response();
        return response()->json($employees,200);
    }

    /**
     * @param \App\Http\Requests\EmployeeWorkingStoreRequest $request
     * @return \App\Http\Resources\EmployeeWorkingResource
     */
    public function store(EmployeeWorkingStoreRequest $request)
    {
        $employeeWorking = EmployeeWorking::create($request->validated());

        return new EmployeeWorkingResource($employeeWorking);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\EmployeeWorking $employeeWorking
     * @return \App\Http\Resources\EmployeeWorkingResource
     */
    public function show(Request $request, EmployeeWorking $employeeWorking)
    {
        return new EmployeeWorkingResource($employeeWorking);
    }

    /**
     * @param \App\Http\Requests\EmployeeWorkingUpdateRequest $request
     * @param \App\Models\EmployeeWorking $employeeWorking
     * @return \App\Http\Resources\EmployeeWorkingResource
     */
    public function update(EmployeeWorkingUpdateRequest $request, EmployeeWorking $employeeWorking)
    {
        $employeeWorking->update($request->validated());

        return new EmployeeWorkingResource($employeeWorking);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\EmployeeWorking $employeeWorking
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, EmployeeWorking $employeeWorking)
    {
        $employeeWorking->delete();

        return response()->noContent();
    }
    public function export(Request $request)
    {
        $cols = [
            //'course_schedule_id',
            'employee.employee_id',
            'date',
            'working_hour',
            'hour_rate',
            'is_paid',];
        $total = ['working_hour'];
        $headers = [
            //'course_schedule_id',
            'employee',
            'Date',
            'Working Hour',
            'Hour Rate',
            'is_paid',];
        return $this->commonDataExporter('EmployeeWorking', $cols, $headers, $total);
    }
}
