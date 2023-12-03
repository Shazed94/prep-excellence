<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentTypeStoreRequest;
use App\Http\Requests\PaymentTypeUpdateRequest;
use App\Http\Resources\PaymentTypeCollection;
use App\Http\Resources\PaymentTypeResource;
use App\Models\PaymentType;
use App\Traits\CommonTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\Request;

class PaymentTypeController extends Controller
{
    use ReportTrait,CommonTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $paymentTypes = PaymentType::all();
        return PaymentTypeResource::collection($paymentTypes);
    }

    /**
     * @param \App\Http\Requests\PaymentTypeStoreRequest $request
     * @return \App\Http\Resources\PaymentTypeResource
     */
    public function store(PaymentTypeStoreRequest $request)
    {
        $paymentType = PaymentType::onlyTrashed()->where(['name' => $request->name])->first();
        if (!empty($paymentType)) {
            $paymentType->restore();
        } else {
            $data = $request->all();
            $data['is_active'] = true;
            $paymentType = PaymentType::create($data + $this->commonFields($request));
        }
        return new PaymentTypeResource($paymentType);
    }

    public function toggle(PaymentType $paymentType)
    {
        try {
            $paymentType->update(['is_active' => !$paymentType->is_active]);
            return response()->json(['status' => 'success', 'message' => 'Status changed'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\PaymentType $paymentType
     * @return \App\Http\Resources\PaymentTypeResource
     */
    public function show(Request $request, PaymentType $paymentType)
    {
        return new PaymentTypeResource($paymentType);
    }


    /**
     * @param \App\Http\Requests\PaymentTypeUpdateRequest $request
     * @param \App\Models\PaymentType $paymentType
     * @return \App\Http\Resources\PaymentTypeResource
     */
    public function update(PaymentTypeUpdateRequest $request, PaymentType $paymentType)
    {
        $data = $request->all();
        $paymentType->update($data + $this->commonFields($request));

        return new PaymentTypeResource($paymentType);
    }

    public function export(Request $request)
    {
//        $rules = [
//            'ids' => 'nullable|array',
//        ];
//        validator(request()->query(), $rules)->validate();

        $cols = ['name', 'details', 'is_active', 'createdBy.name'];
        $headers = ['Name', 'Details', 'Status', 'Created By'];
        return $this->commonDataExporter('PaymentType', $cols, $headers);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\PaymentType $paymentType
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, PaymentType $paymentType)
    {
        $paymentType->delete();

        return response()->noContent();
    }
}
