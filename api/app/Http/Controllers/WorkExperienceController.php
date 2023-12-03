<?php

namespace App\Http\Controllers;

use App\Http\Requests\WorkExperienceStoreRequest;
use App\Http\Requests\WorkExperienceUpdateRequest;
use App\Http\Resources\WorkExperienceCollection;
use App\Http\Resources\WorkExperienceResource;
use App\Models\WorkExperience;
use Illuminate\Http\Request;

class WorkExperienceController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\WorkExperienceCollection
     */
    public function index(Request $request)
    {
        $workExperiences = WorkExperience::all();

        return new WorkExperienceCollection($workExperiences);
    }

    /**
     * @param \App\Http\Requests\WorkExperienceStoreRequest $request
     * @return \App\Http\Resources\WorkExperienceResource
     */
    public function store(WorkExperienceStoreRequest $request)
    {
        $workExperience = WorkExperience::create($request->validated());

        return new WorkExperienceResource($workExperience);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\WorkExperience $workExperience
     * @return \App\Http\Resources\WorkExperienceResource
     */
    public function show(Request $request, WorkExperience $workExperience)
    {
        return new WorkExperienceResource($workExperience);
    }

    /**
     * @param \App\Http\Requests\WorkExperienceUpdateRequest $request
     * @param \App\Models\WorkExperience $workExperience
     * @return \App\Http\Resources\WorkExperienceResource
     */
    public function update(WorkExperienceUpdateRequest $request, WorkExperience $workExperience)
    {
        $workExperience->update($request->validated());

        return new WorkExperienceResource($workExperience);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\WorkExperience $workExperience
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, WorkExperience $workExperience)
    {
        $workExperience->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }
}
