<?php

namespace App\Http\Controllers;
use App\Http\Requests\ExpenseStoreRequest;
use App\Http\Requests\ExpenseUpdateRequest;
use App\Http\Resources\ExpenseCollection;
use App\Http\Resources\ExpenseResource;
use App\Models\Expense;
use App\Traits\CommonTrait;
use App\Traits\ReportTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    use CommonTrait,ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $start_date = request('start_date');
        $end_date = request('end_date');
        $expense = Expense::query();
        if ($search) {
            $expense->whereLike(['invoice_no','amount', 'check_no'], $search);
        }
        if ($start_date) {
            $expense->whereDate('created_at', '>=', $start_date);
        }
        if ($end_date) {
            $expense->whereDate('created_at', '<=' , $end_date);
        }

        $expenses = $expense->with(['expenseType', 'subExpenseType', 'paymentType', 'bankAccount'])->orderBy('id','DESC')->paginate($itemsPerPage);

        return ExpenseResource::collection($expenses);
    }

    /*public function report()
    {
        return (new ReportExpense())->getReport();
    }*/

    /**
     * @param \App\Http\Requests\ExpenseStoreRequest $request
     * @return \App\Http\Resources\ExpenseResource
     */
    public function store(ExpenseStoreRequest $request)
    {
        $data = $request->except('expense_date', 'check_date','invoice_no');
        $data +=[
            'is_active'=>true,
            'invoice_no'=>uniqid()
        ];

        if (request()->filled('expense_date')) {
            $data['expense_date'] = Carbon::parse(request('expense_date'));
        } else {
            $data['expense_date'] = now();
        }
        if (request()->filled('check_date')) {
            $data['check_date'] = Carbon::parse(request('check_date'));
        } else {
            $data['check_date'] = now();
        }
        $expense = Expense::create($data + $this->commonFields($request));
        $expense->load('expenseType', 'subExpenseType', 'paymentType', 'bankAccount');

        return new ExpenseResource($expense);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Expense $expense
     * @return \App\Http\Resources\ExpenseResource
     */
    public function show(Request $request, Expense $expense)
    {
        return new ExpenseResource($expense);
    }

    /**
     * @param \App\Http\Requests\ExpenseUpdateRequest $request
     * @param \App\Models\Expense $expense
     * @return \App\Http\Resources\ExpenseResource
     */
    public function update(ExpenseUpdateRequest $request, Expense $expense)
    {
        $data = $request->except('expense_date', 'check_date','invoice_no');

        if (request()->filled('expense_date')) {
            $data['expense_date'] = Carbon::parse(request('expense_date'));
        }
        if (request()->filled('check_date')) {
            $data['check_date'] = Carbon::parse(request('check_date'));
        }
        if (!isset($data['sub_expense_type_id'])) $data['sub_expense_type_id'] = null;
        $expense->update($data + $this->commonFields($request));
        $expense->load('expenseType', 'subExpenseType', 'paymentType', 'bankAccount');

        return new ExpenseResource($expense);
    }

    public function toggle(Expense $expense)
    {
        try {
            $expense->update(['is_active' => !$expense->is_active]);
            return response()->json(['status' => 'success', 'message'=> 'Status changed'], 200);
        } catch (\Exception $e){
            return response()->json(['status' => 'error', 'message'=> 'Invalid request'],200);
        }
    }

    public function export(Request $request)
    {
//        $rules = [
//            'ids' => 'nullable|array',
//        ];
//        validator(request()->query(), $rules)->validate();

        $cols = ['invoice_no', 'expenseType.name', 'subExpenseType.name', 'expense_date', 'amount', 'paymentType.name', 'bankAccount.account_no', 'check_no', 'check_date', 'is_active', 'createdBy.name'];
        $headers = ['Invoice No', 'Expense Type', 'Sub Expense Type', 'Expense Date', 'Amount', 'Payment Type', 'BANK Account', 'Check No.', 'Check Date', 'Status', 'created By'];
        $totals=['amount'];
        return $this->commonDataExporter('Expense', $cols, $headers, $totals);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Expense $expense
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Expense $expense)
    {
        $expense->delete();

        return response()->noContent();
    }
}
