<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubExpenseTypeStoreRequest;
use App\Http\Requests\SubExpenseTypeUpdateRequest;
use App\Http\Resources\SubExpenseTypeCollection;
use App\Http\Resources\SubExpenseTypeResource;
use App\Models\SubExpenseType;
use App\Traits\CommonTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\Request;

class SubExpenseTypeController extends Controller
{
    use CommonTrait, ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $subExpenseTypes = SubExpenseType::with('expenseType')->get();

        return SubExpenseTypeResource::collection($subExpenseTypes);
    }

    /**
     * @param \App\Http\Requests\SubExpenseTypeStoreRequest $request
     * @return \App\Http\Resources\SubExpenseTypeResource
     */
    public function store(SubExpenseTypeStoreRequest $request)
    {
        $subExpenseType = SubExpenseType::onlyTrashed()->where(['name' => $request->name])->first();
        if (!empty($subExpenseType)) {
            $subExpenseType->restore();
            $subExpenseType->load('expenseType');
        } else {
            $data = $request->all();
            $data['is_active'] = true;
            $subExpenseType = SubExpenseType::create($data + $this->commonFields($request));
            $subExpenseType->load('expenseType');
        }

        return new SubExpenseTypeResource($subExpenseType);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\SubExpenseType $subExpenseType
     * @return \App\Http\Resources\SubExpenseTypeResource
     */
    public function show(Request $request, SubExpenseType $subExpenseType)
    {
        return new SubExpenseTypeResource($subExpenseType);
    }

    /**
     * @param \App\Http\Requests\SubExpenseTypeUpdateRequest $request
     * @param \App\Models\SubExpenseType $subExpenseType
     * @return \App\Http\Resources\SubExpenseTypeResource
     */
    public function update(SubExpenseTypeUpdateRequest $request, SubExpenseType $subExpenseType)
    {
        $data = $request->all();
        $subExpenseType->update($data + $this->commonFields($request));
        $subExpenseType->load('expenseType');
        return new SubExpenseTypeResource($subExpenseType);
    }

    public function toggle(SubExpenseType $subExpenseType)
    {
        try {
            $subExpenseType->update(['is_active' => !$subExpenseType->is_active]);
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
        $cols = ['name', 'expenseType.name', 'is_active', 'createdBy.name'];
        $headers = ['Name', 'Expense Type', 'Status', 'Created By'];
        return $this->commonDataExporter('SubExpenseType', $cols, $headers);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\SubExpenseType $subExpenseType
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, SubExpenseType $subExpenseType)
    {
        $subExpenseType->delete();

        return response()->noContent();
    }
}
