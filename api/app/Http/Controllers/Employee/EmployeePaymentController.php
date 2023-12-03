<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Resources\EmployeePaymentCollection;
use App\Models\EmployeePayment;
use Illuminate\Http\Request;

class EmployeePaymentController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\EmployeePaymentCollection
     */
    public function index(Request $request)
    {
        $emp = auth()->user()->userable;
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $employeePayments = EmployeePayment::query();
        $employeePayments->where('employee_id',$emp->id);
        /*if ($search) {
            $employeePayments->whereLike(['title','description'], $search);
        }*/

        return new EmployeePaymentCollection($employeePayments->paginate($itemsPerPage));
    }
}
