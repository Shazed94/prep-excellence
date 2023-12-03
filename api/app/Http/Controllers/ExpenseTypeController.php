<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExpenseTypeStoreRequest;
use App\Http\Requests\ExpenseTypeUpdateRequest;
use App\Http\Resources\ExpenseTypeCollection;
use App\Http\Resources\ExpenseTypeResource;
use App\Models\ExpenseType;
use App\Traits\CommonTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\Request;

class ExpenseTypeController extends Controller
{
    use CommonTrait, ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $expenseTypes = ExpenseType::all();

        return ExpenseTypeResource::collection($expenseTypes);
    }

    /**
     * @param \App\Http\Requests\ExpenseTypeStoreRequest $request
     * @return \App\Http\Resources\ExpenseTypeResource
     */
    public function store(ExpenseTypeStoreRequest $request)
    {
        $expenseType = ExpenseType::onlyTrashed()->where(['name' => $request->name])->first();
        if (!empty($expenseType)) {
            $expenseType->restore();
        } else {
            $data = $request->all();
            $data['is_active'] = true;
            $expenseType = ExpenseType::create($data + $this->commonFields($request));
        }

        return new ExpenseTypeResource($expenseType);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ExpenseType $expenseType
     * @return \App\Http\Resources\ExpenseTypeResource
     */
    public function show(Request $request, ExpenseType $expenseType)
    {
        return new ExpenseTypeResource($expenseType);
    }

    /**
     * @param \App\Http\Requests\ExpenseTypeUpdateRequest $request
     * @param \App\Models\ExpenseType $expenseType
     * @return \App\Http\Resources\ExpenseTypeResource
     */
    public function update(ExpenseTypeUpdateRequest $request, ExpenseType $expenseType)
    {
        $data = $request->all();
        $expenseType->update($data + $this->commonFields($request));

        return new ExpenseTypeResource($expenseType);
    }

    public function toggle(ExpenseType $expenseType)
    {
        try {
            $expenseType->update(['is_active' => !$expenseType->is_active]);
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
        $cols = ['name', 'type', 'is_active', 'createdBy.name'];
        $headers = ['Name', 'Type', 'Status', 'Created By'];
        return $this->commonDataExporter('ExpenseType', $cols, $headers);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ExpenseType $expenseType
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, ExpenseType $expenseType)
    {
        $expenseType->delete();

        return response()->noContent();
    }
}
