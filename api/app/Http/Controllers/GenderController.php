<?php

namespace App\Http\Controllers;

use App\Http\Requests\GenderStoreRequest;
use App\Http\Requests\GenderUpdateRequest;
use App\Http\Resources\GenderCollection;
use App\Http\Resources\GenderResource;
use App\Models\Gender;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GenderController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\GenderCollection
     */
    public function index(Request $request)
    {
        $genders = Gender::all();

        return new GenderCollection($genders);
    }

    /**
     * @param \App\Http\Requests\GenderStoreRequest $request
     * @return \App\Http\Resources\GenderResource
     */
    public function store(GenderStoreRequest $request)
    {
        $gender = Gender::create($request->validated());

        return new GenderResource($gender);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Gender $gender
     * @return \App\Http\Resources\GenderResource
     */
    public function show(Request $request, Gender $gender)
    {
        return new GenderResource($gender);
    }

    /**
     * @param \App\Http\Requests\GenderUpdateRequest $request
     * @param \App\Models\Gender $gender
     * @return \App\Http\Resources\GenderResource
     */
    public function update(GenderUpdateRequest $request, Gender $gender)
    {
        $gender->update($request->validated());

        return new GenderResource($gender);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Gender $gender
     * @return JsonResponse
     */
    public function destroy(Request $request, Gender $gender)
    {
        $gender->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(Gender $gender): JsonResponse
    {
        try {
            $gender->update(['is_active' => !$gender->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }

}
