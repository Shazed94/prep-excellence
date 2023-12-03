<?php

namespace App\Http\Controllers;

use App\Http\Requests\BankStoreRequest;
use App\Http\Requests\BankUpdateRequest;
use App\Http\Resources\BankCollection;
use App\Http\Resources\BankResource;
use App\Models\Bank;
use App\Traits\CommonTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\Request;

class BankController extends Controller
{
    use CommonTrait, ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $banks = Bank::all();

        return BankResource::collection($banks);
    }

    /**
     * @param \App\Http\Requests\BankStoreRequest $request
     * @return \App\Http\Resources\BankResource
     */
    public function store(BankStoreRequest $request)
    {
        $bank = Bank::onlyTrashed()->where(['name' => $request->name])->first();
        if (!empty($bank)) {
            $bank->restore();
        } else {
            $data = $request->only('name');
            $data +=['is_active'=>1];
            $bank = Bank::create($data + $this->commonFields($request));
        }
        return new BankResource($bank);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Bank $bank
     * @return \App\Http\Resources\BankResource
     */
    public function show(Request $request, Bank $bank)
    {
        return new BankResource($bank);
    }

    /**
     * @param \App\Http\Requests\BankUpdateRequest $request
     * @param \App\Models\Bank $bank
     * @return \App\Http\Resources\BankResource
     */
    public function update(BankUpdateRequest $request, Bank $bank)
    {
        $data = $request->only('name');
        $bank->update($data + $this->commonFields($request));

        return new BankResource($bank);
    }

    public function toggle(Bank $bank)
    {
        try {
            $bank->update(['is_active' => !$bank->is_active]);
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
        $cols = ['name', 'is_active', 'createdBy.name'];
        $headers = ['Name', 'Status', 'Created By'];
        return $this->commonDataExporter('Bank', $cols, $headers);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Bank $bank
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Bank $bank)
    {
        $bank->delete();

        return response()->noContent();
    }
}
