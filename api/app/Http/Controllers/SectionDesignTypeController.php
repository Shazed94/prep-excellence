<?php

namespace App\Http\Controllers;

use App\Http\Requests\SectionDesignTypeStoreRequest;
use App\Http\Requests\SectionDesignTypeUpdateRequest;
use App\Http\Resources\SectionDesignTypeCollection;
use App\Http\Resources\SectionDesignTypeResource;
use App\Models\SectionDesignType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SectionDesignTypeController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\SectionDesignTypeCollection
     */
    public function index(Request $request)
    {
        $sectionDesignTypes = SectionDesignType::all();

        return new SectionDesignTypeCollection($sectionDesignTypes);
    }

    /**
     * @param \App\Http\Requests\SectionDesignTypeStoreRequest $request
     * @return \App\Http\Resources\SectionDesignTypeResource
     */
    public function store(SectionDesignTypeStoreRequest $request)
    {
        $sectionDesignType = SectionDesignType::create($request->validated());

        return new SectionDesignTypeResource($sectionDesignType);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\SectionDesignType $sectionDesignType
     * @return \App\Http\Resources\SectionDesignTypeResource
     */
    public function show(Request $request, SectionDesignType $sectionDesignType)
    {
        return new SectionDesignTypeResource($sectionDesignType);
    }

    /**
     * @param \App\Http\Requests\SectionDesignTypeUpdateRequest $request
     * @param \App\Models\SectionDesignType $sectionDesignType
     * @return \App\Http\Resources\SectionDesignTypeResource
     */
    public function update(SectionDesignTypeUpdateRequest $request, SectionDesignType $sectionDesignType)
    {
        $sectionDesignType->update($request->validated());

        return new SectionDesignTypeResource($sectionDesignType);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\SectionDesignType $sectionDesignType
     * @return JsonResponse
     */
    public function destroy(Request $request, SectionDesignType $sectionDesignType)
    {
        $sectionDesignType->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(SectionDesignType $sectionDesignType): JsonResponse
    {
        try {
            $sectionDesignType->update(['is_active' => !$sectionDesignType->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
}
