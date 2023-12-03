<?php

namespace App\Http\Controllers;

use App\Http\Requests\DesignationStoreRequest;
use App\Http\Requests\DesignationUpdateRequest;
use App\Http\Resources\DesignationCollection;
use App\Http\Resources\DesignationResource;
use App\Models\Designation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DesignationController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\DesignationCollection
     */
    public function index(Request $request)
    {
        $designations = Designation::all();

        return new DesignationCollection($designations);
    }

    /**
     * @param \App\Http\Requests\DesignationStoreRequest $request
     * @return \App\Http\Resources\DesignationResource
     */
    public function store(DesignationStoreRequest $request)
    {
        $designation = Designation::create($request->validated());

        return new DesignationResource($designation);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Designation $designation
     * @return \App\Http\Resources\DesignationResource
     */
    public function show(Request $request, Designation $designation)
    {
        return new DesignationResource($designation);
    }

    /**
     * @param \App\Http\Requests\DesignationUpdateRequest $request
     * @param \App\Models\Designation $designation
     * @return \App\Http\Resources\DesignationResource
     */
    public function update(DesignationUpdateRequest $request, Designation $designation)
    {
        $designation->update($request->validated());

        return new DesignationResource($designation);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Designation $designation
     * @return JsonResponse
     */
    public function destroy(Request $request, Designation $designation)
    {
        $designation->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(Designation $designation): JsonResponse
    {
        try {
            $designation->update(['is_active' => !$designation->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
}
