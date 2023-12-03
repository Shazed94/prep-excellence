<?php

namespace App\Http\Controllers;

use App\Http\Requests\MaritalStatusStoreRequest;
use App\Http\Requests\MaritalStatusUpdateRequest;
use App\Http\Resources\MaritalStatusCollection;
use App\Http\Resources\MaritalStatusResource;
use App\Models\MaritalStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MaritalStatusController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\MaritalStatusCollection
     */
    public function index(Request $request)
    {
        $maritalStatuses = MaritalStatus::all();

        return new MaritalStatusCollection($maritalStatuses);
    }

    /**
     * @param \App\Http\Requests\MaritalStatusStoreRequest $request
     * @return \App\Http\Resources\MaritalStatusResource
     */
    public function store(MaritalStatusStoreRequest $request)
    {
        $maritalStatus = MaritalStatus::create($request->validated());

        return new MaritalStatusResource($maritalStatus);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\MaritalStatus $maritalStatus
     * @return \App\Http\Resources\MaritalStatusResource
     */
    public function show(Request $request, MaritalStatus $maritalStatus)
    {
        return new MaritalStatusResource($maritalStatus);
    }

    /**
     * @param \App\Http\Requests\MaritalStatusUpdateRequest $request
     * @param \App\Models\MaritalStatus $maritalStatus
     * @return \App\Http\Resources\MaritalStatusResource
     */
    public function update(MaritalStatusUpdateRequest $request, MaritalStatus $maritalStatus)
    {
        $maritalStatus->update($request->validated());

        return new MaritalStatusResource($maritalStatus);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\MaritalStatus $maritalStatus
     * @return JsonResponse
     */
    public function destroy(Request $request, MaritalStatus $maritalStatus)
    {
        $maritalStatus->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(MaritalStatus $maritalStatus): JsonResponse
    {
        try {
            $maritalStatus->update(['is_active' => !$maritalStatus->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
}
