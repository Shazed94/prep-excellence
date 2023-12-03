<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeePaymentStoreRequest;
use App\Http\Requests\EmployeePaymentUpdateRequest;
use App\Http\Resources\EmployeePaymentCollection;
use App\Http\Resources\EmployeePaymentResource;
use App\Models\EmployeeOverTime;
use App\Models\EmployeePayment;
use App\Models\EmployeeWorking;
use App\Traits\EmailTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;

class EmployeePaymentController extends Controller
{
    use ReportTrait, EmailTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\EmployeePaymentCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $is_paid = request('is_paid');
        $employeePayments = EmployeePayment::query();
        if ($search) $employeePayments->whereLike(['invoice_no','date','employee.employee_id'], $search);
        if ($is_paid != null ) $employeePayments->where('is_paid', $is_paid);
        $employeePayments = $employeePayments->with([
            'employee'=>function($q){$q->select('id','employee_id'); },
            'employee.userable'=>function($q){$q->select('id','userable_id','userable_type','first_name','last_name','email','phone_number'); },
        ])->orderBy('id','DESC')->paginate($itemsPerPage);
        return new EmployeePaymentCollection($employeePayments);
    }

    public function prepareBill(Request $request)
    {
        $data = Validator::make($request->all(),[
            'ids'=>'required|exists:employee_workings,id',
            'employee_id'=>'required|not_in:0|exists:employees,id',
        ])->validate();
        //return $data;
        $wks = EmployeeWorking::whereIn('id',$data['ids'])->where(['employee_id'=>$data['employee_id'], 'is_paid'=>0])->get();
        $total_hour = $wks->sum('working_hour');
        $avg_rate = $wks->avg('hour_rate');
        $amount = $total_hour * $avg_rate;
        $data2=[
            'invoice_no'=>uniqid(),
            'employee_id'=>$data['employee_id'],
            'date'=>Carbon::today(),
            'regular_hour'=>$total_hour,
            'total_hour'=>$total_hour,
            'regular_amount'=>$amount,
            'total_amount'=>$amount,
            'is_paid'=>0,
        ];
        $payment = EmployeePayment::create($data2);
        $payment->employeeWorkings()->sync($data['ids']);
        if (isset($payment->id)) {
            EmployeeWorking::whereIn('id',$data['ids'])->where(['employee_id'=>$data['employee_id'], 'is_paid'=>0])->update(['is_paid'=>1]);
        }
        return new EmployeePaymentResource($payment);
    }

    public function prepareBill2(Request $request)
    {
        $data = Validator::make($request->all(),[
            'ids'=>'required|exists:employee_over_times,id',
            'employee_id'=>'required|not_in:0|exists:employees,id',
        ])->validate();
        //return $data;
        $wks = EmployeeOverTime::whereIn('id',$data['ids'])->where(['employee_id'=>$data['employee_id'], 'is_paid'=>0])->get();
        $total_hour = $wks->sum('working_hour');
        $avg_rate = $wks->avg('hour_rate');
        $amount = $total_hour * $avg_rate;
        $data2=[
            'invoice_no'=>uniqid(),
            'employee_id'=>$data['employee_id'],
            'date'=>Carbon::today(),
            'ot_hour'=>$total_hour,
            'total_hour'=>$total_hour,
            'ot_amount'=>$amount,
            'total_amount'=>$amount,
            'is_paid'=>0,
        ];
        $payment = EmployeePayment::create($data2);
        $payment->employeeOverTimes()->sync($data['ids']);
        if (isset($payment->id)) {
            EmployeeOverTime::whereIn('id',$data['ids'])->where(['employee_id'=>$data['employee_id'], 'is_paid'=>0])->update(['is_paid'=>1]);
        }
        return new EmployeePaymentResource($payment);
    }

    /**
     * @param \App\Http\Requests\EmployeePaymentStoreRequest $request
     * @return \App\Http\Resources\EmployeePaymentResource
     */
    public function store(EmployeePaymentStoreRequest $request)
    {
        $employeePayment = EmployeePayment::create($request->validated());

        return new EmployeePaymentResource($employeePayment);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\EmployeePayment $employeePayment
     * @return \App\Http\Resources\EmployeePaymentResource
     */
    public function show(Request $request, EmployeePayment $employeePayment)
    {
        return new EmployeePaymentResource($employeePayment);
    }

    /**
     * @param \App\Http\Requests\EmployeePaymentUpdateRequest $request
     * @param \App\Models\EmployeePayment $employeePayment
     * @return \App\Http\Resources\EmployeePaymentResource
     */
    public function update(EmployeePaymentUpdateRequest $request, EmployeePayment $employeePayment)
    {
        $employeePayment->update($request->validated());

        return new EmployeePaymentResource($employeePayment);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\EmployeePayment $employeePayment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, EmployeePayment $employeePayment)
    {
        $employeePayment->delete();

        return response()->noContent();
    }
    public function toggle(EmployeePayment $employeePayment): JsonResponse
    {
        try {
            $employeePayment->update(['is_paid' => !$employeePayment->is_paid]);
            if ($employeePayment->is_paid){
                $emp = $employeePayment->employee;
                if(isset($emp->id)){
                    $user = $emp->userable;
                    if (isset($user->id) && $user->email){
                        $this->defaultEmail($user->name,$user->email,"Employee payment alert","Your payment has been completed. total hour $employeePayment->total_hour and paid amount is $employeePayment->total_amount");
                    }
                }
            }
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }

    public function export(Request $request)
    {
        $cols = ['invoice_no',
            'employee.employee_id',
            'date',
            'regular_hour',
            'ot_hour',
            'total_hour',
            'regular_amount',
            'ot_amount',
            'total_amount',
            'payment_type',
            'note',
            'is_paid'];
        $total = ['regular_hour','ot_hour','total_hour','regular_amount','ot_amount','total_amount'];
        $headers = ['Invoice No','Employee', 'Date', 'Regular Hour',
            'OT Hour', 'Total Hour','Regular Amount','OT Amount','Total Amount',
            'Payment Type', 'Note','is paid'];
        return $this->commonDataExporter('EmployeePayment', $cols, $headers, $total);
    }
}
