<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Requests\EmployeeWorkingStoreRequest;
use App\Http\Requests\EmployeeWorkingUpdateRequest;
use App\Http\Resources\EmployeeWorkingCollection;
use App\Http\Resources\EmployeeWorkingResource;
use App\Models\EmployeeWorking;
use App\Traits\ReportTrait;
use Illuminate\Http\Request;

class EmployeeWorkingController extends Controller
{
    use ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\EmployeeWorkingCollection
     */
    public function index(Request $request)
    {
        $emp = auth()->user()->userable;
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $employeeWorkings = EmployeeWorking::query();
        $employeeWorkings->where('employee_id',$emp->id);
        /*if ($search) {
            $employeeWorkings->whereLike(['title','description'], $search);
        }*/

        return new EmployeeWorkingCollection($employeeWorkings->paginate($itemsPerPage));
    }

    public function export(Request $request)
    {
        $emp = auth()->user()->userable;
        $cols = ['date', 'working_hour','hour_rate','is_paid'];
        $headers = ['Date', 'Working Hour','Hour Rate','Is Paid'];
        $total=[];
        $where=[];
        $where[]=[
            'name'=>'employee_id',
            'value'=>$emp->id
        ];
        $template='exporter.commonTablePdf2';
        return $this->commonDataExporter('EmployeeWorking', $cols, $headers,$total,$where,$template);

    }
}
