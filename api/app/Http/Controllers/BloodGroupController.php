<?php

namespace App\Http\Controllers;

use App\Http\Requests\BloodGroupStoreRequest;
use App\Http\Requests\BloodGroupUpdateRequest;
use App\Http\Resources\BloodGroupCollection;
use App\Http\Resources\BloodGroupResource;
use App\Models\BloodGroup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BloodGroupController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\BloodGroupCollection
     */
    public function index(Request $request)
    {
        $bloodGroups = BloodGroup::all();

        return new BloodGroupCollection($bloodGroups);
    }

    /**
     * @param \App\Http\Requests\BloodGroupStoreRequest $request
     * @return \App\Http\Resources\BloodGroupResource
     */
    public function store(BloodGroupStoreRequest $request)
    {
        $bloodGroup = BloodGroup::create($request->validated());

        return new BloodGroupResource($bloodGroup);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\BloodGroup $bloodGroup
     * @return \App\Http\Resources\BloodGroupResource
     */
    public function show(Request $request, BloodGroup $bloodGroup)
    {
        return new BloodGroupResource($bloodGroup);
    }

    /**
     * @param \App\Http\Requests\BloodGroupUpdateRequest $request
     * @param \App\Models\BloodGroup $bloodGroup
     * @return \App\Http\Resources\BloodGroupResource
     */
    public function update(BloodGroupUpdateRequest $request, BloodGroup $bloodGroup)
    {
        $bloodGroup->update($request->validated());

        return new BloodGroupResource($bloodGroup);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\BloodGroup $bloodGroup
     * @return JsonResponse
     */
    public function destroy(Request $request, BloodGroup $bloodGroup)
    {
        $bloodGroup->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(BloodGroup $bloodGroup): JsonResponse
    {
        try {
            $bloodGroup->update(['is_active' => !$bloodGroup->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
}
