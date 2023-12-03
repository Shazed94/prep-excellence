<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReligionStoreRequest;
use App\Http\Requests\ReligionUpdateRequest;
use App\Http\Resources\ReligionCollection;
use App\Http\Resources\ReligionResource;
use App\Models\Religion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReligionController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\ReligionCollection
     */
    public function index(Request $request)
    {
        $religions = Religion::all();

        return new ReligionCollection($religions);
    }

    /**
     * @param \App\Http\Requests\ReligionStoreRequest $request
     * @return \App\Http\Resources\ReligionResource
     */
    public function store(ReligionStoreRequest $request)
    {
        $religion = Religion::create($request->validated());

        return new ReligionResource($religion);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Religion $religion
     * @return \App\Http\Resources\ReligionResource
     */
    public function show(Request $request, Religion $religion)
    {
        return new ReligionResource($religion);
    }

    /**
     * @param \App\Http\Requests\ReligionUpdateRequest $request
     * @param \App\Models\Religion $religion
     * @return \App\Http\Resources\ReligionResource
     */
    public function update(ReligionUpdateRequest $request, Religion $religion)
    {
        $religion->update($request->validated());

        return new ReligionResource($religion);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Religion $religion
     * @return JsonResponse
     */
    public function destroy(Request $request, Religion $religion)
    {
        $religion->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(Religion $religion): JsonResponse
    {
        try {
            $religion->update(['is_active' => !$religion->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
}
