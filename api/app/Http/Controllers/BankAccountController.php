<?php

namespace App\Http\Controllers;

use App\Http\Requests\BankAccountStoreRequest;
use App\Http\Requests\BankAccountUpdateRequest;
use App\Http\Resources\BankAccountCollection;
use App\Http\Resources\BankAccountResource;
use App\Models\BankAccount;
use App\Traits\CommonTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\Request;

class BankAccountController extends Controller
{
    use CommonTrait, ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $bankAccounts = BankAccount::with('bank')->get();

        return BankAccountResource::collection($bankAccounts);
    }

    /**
     * @param \App\Http\Requests\BankAccountStoreRequest $request
     * @return \App\Http\Resources\BankAccountResource
     */
    public function store(BankAccountStoreRequest $request)
    {
        $bankAccount = BankAccount::onlyTrashed()->where(['title' => $request->title])->first();
        if (!empty($bankAccount)) {
            $bankAccount->restore();
            $bankAccount->load('bank');
        } else {
            $data = $request->all();
            $data['is_active'] = true;
            $bankAccount = BankAccount::create($data + $this->commonFields($request));
            $bankAccount->load('bank');
        }

        return new BankAccountResource($bankAccount);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\BankAccount $bankAccount
     * @return \App\Http\Resources\BankAccountResource
     */
    public function show(Request $request, BankAccount $bankAccount)
    {
        return new BankAccountResource($bankAccount);
    }

    /**
     * @param \App\Http\Requests\BankAccountUpdateRequest $request
     * @param \App\Models\BankAccount $bankAccount
     * @return \App\Http\Resources\BankAccountResource
     */
    public function update(BankAccountUpdateRequest $request, BankAccount $bankAccount)
    {
        $data = $request->all();
        $bankAccount->update($data + $this->commonFields($request));
        $bankAccount->load('bank');

        return new BankAccountResource($bankAccount);
    }

    public function toggle(BankAccount $bankAccount)
    {
        try {
            $bankAccount->update(['is_active' => !$bankAccount->is_active]);
            return response()->json(['status' => 'success', 'message' => 'Status changed'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }

    public function export(Request $request)
    {
        //        $rules = [
//            'ids' => 'nullable|array',
//        ];
//        validator(request()->query(), $rules)->validate();
        $cols = ['title', 'bank.name', 'account_no', 'is_active', 'createdBy.name'];
        $headers = ['Title', 'Bank Name', 'Account Number', 'Status', 'Created By'];
        return $this->commonDataExporter('BankAccount', $cols, $headers);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\BankAccount $bankAccount
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, BankAccount $bankAccount)
    {
        $bankAccount->delete();

        return response()->noContent();
    }
}
