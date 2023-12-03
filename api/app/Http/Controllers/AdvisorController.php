<?php

namespace App\Http\Controllers;

use App\Http\Requests\AdvisorStoreRequest;
use App\Http\Requests\AdvisorUpdateRequest;
use App\Http\Resources\AdvisorCollection;
use App\Http\Resources\AdvisorResource;
use App\Models\Advisor;
use App\Traits\CommonTrait;
use Illuminate\Http\Request;

class AdvisorController extends Controller
{
    use CommonTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\AdvisorCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $advisors = Advisor::query();
        if ($search) {
            $advisors->whereLike(['name','designation','email','phone_number'], $search);
        }
        $advisors = $advisors->orderBy('id','DESC')->paginate($itemsPerPage);

        return new AdvisorCollection($advisors);
    }

    /**
     * @param \App\Http\Requests\AdvisorStoreRequest $request
     * @return \App\Http\Resources\AdvisorResource
     */
    public function store(AdvisorStoreRequest $request)
    {
        $data = $request->validated();
        unset($data['image']);
        if ($request->file('image')){
            $img = $this->uploadPhoto($request->file('image'),'advisor/',['w'=>500,'h'=>500]);
            $data +=[
                'image'=>$img,
            ];
        }
        $data +=$this->storeMetadata($request);
        $data +=[
            'is_active'=>1,
        ];
        $advisor = Advisor::create($data);

        return new AdvisorResource($advisor);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Advisor $advisor
     * @return \App\Http\Resources\AdvisorResource
     */
    public function show(Request $request, Advisor $advisor)
    {
        return new AdvisorResource($advisor);
    }

    /**
     * @param \App\Http\Requests\AdvisorUpdateRequest $request
     * @param \App\Models\Advisor $advisor
     * @return \App\Http\Resources\AdvisorResource
     */
    public function update(AdvisorUpdateRequest $request, Advisor $advisor)
    {
        $data = $request->validated();
        unset($data['image']);
        if ($request->file('image')){
            $img = $this->uploadPhoto($request->file('image'),'advisor/',['w'=>500,'h'=>500]);
            $data +=[
                'image'=>$img,
            ];
        }
        $data +=$this->storeMetadata($request);
        $advisor->update($data);

        return new AdvisorResource($advisor);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Advisor $advisor
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Advisor $advisor)
    {
        $advisor->delete();

        return response()->noContent();
    }
    public function toggle(Advisor $advisor)
    {
        try {
            $advisor->update(['is_active' => !$advisor->is_active]);
            return response()->json(['status' => 'success', 'message' => 'Status changed'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
}
