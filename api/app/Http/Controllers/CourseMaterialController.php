<?php

namespace App\Http\Controllers;

use App\Http\Requests\CourseMaterialStoreRequest;
use App\Http\Requests\CourseMaterialUpdateRequest;
use App\Http\Resources\CourseMaterialCollection;
use App\Http\Resources\CourseMaterialResource;
use App\Models\CourseMaterial;
use Illuminate\Http\Request;

class CourseMaterialController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\CourseMaterialCollection
     */
    public function index(Request $request)
    {
        $courseMaterials = CourseMaterial::all();

        return new CourseMaterialCollection($courseMaterials);
    }

    /**
     * @param \App\Http\Requests\CourseMaterialStoreRequest $request
     * @return \App\Http\Resources\CourseMaterialResource
     */
    public function store(CourseMaterialStoreRequest $request)
    {
        $courseMaterial = CourseMaterial::create($request->validated());

        return new CourseMaterialResource($courseMaterial);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\CourseMaterial $courseMaterial
     * @return \App\Http\Resources\CourseMaterialResource
     */
    public function show(Request $request, CourseMaterial $courseMaterial)
    {
        return new CourseMaterialResource($courseMaterial);
    }

    /**
     * @param \App\Http\Requests\CourseMaterialUpdateRequest $request
     * @param \App\Models\CourseMaterial $courseMaterial
     * @return \App\Http\Resources\CourseMaterialResource
     */
    public function update(CourseMaterialUpdateRequest $request, CourseMaterial $courseMaterial)
    {
        $courseMaterial->update($request->validated());

        return new CourseMaterialResource($courseMaterial);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\CourseMaterial $courseMaterial
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, CourseMaterial $courseMaterial)
    {
        $courseMaterial->delete();

        return response()->noContent();
    }
}
