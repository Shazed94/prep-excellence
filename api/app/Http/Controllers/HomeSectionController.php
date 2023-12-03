<?php

namespace App\Http\Controllers;

use App\Http\Requests\HomeSectionStoreRequest;
use App\Http\Requests\HomeSectionUpdateRequest;
use App\Http\Resources\HomeSectionCollection;
use App\Http\Resources\HomeSectionResource;
use App\Models\HomeSection;
use App\Traits\FileUploadTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class HomeSectionController extends Controller
{
    use FileUploadTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\HomeSectionCollection
     */
    public function index(Request $request)
    {
        $homeSections = HomeSection::orderBy('position','ASC')->get();

        return new HomeSectionCollection($homeSections);
    }

    /**
     * @param \App\Http\Requests\HomeSectionStoreRequest $request
     * @return \App\Http\Resources\HomeSectionResource
     */
    public function store(HomeSectionStoreRequest $request)
    {
        $data = $request->except(['image','bg_image']);
        if ($request->file('image')){
            $img = $this->uploadPhoto($request->file('image'),'homeSection');
            $data +=[
                'image'=>$img,
            ];
        }
        if ($request->bg_type==2){
            if ($request->file('bg_image')){
                $video = $this->uploadPhoto($request->file('bg_image'),'homeSection/bg');
                $data +=[
                    'bg_image'=>$video,
                ];
            }
        }
        $request->validated();
        $homeSection = HomeSection::create($data);
        Cache::forget('homeSections');
        return new HomeSectionResource($homeSection);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\HomeSection $homeSection
     * @return \App\Http\Resources\HomeSectionResource
     */
    public function show(Request $request, HomeSection $homeSection)
    {
        return new HomeSectionResource($homeSection);
    }

    /**
     * @param \App\Http\Requests\HomeSectionUpdateRequest $request
     * @param \App\Models\HomeSection $homeSection
     * @return \App\Http\Resources\HomeSectionResource
     */
    public function update(HomeSectionUpdateRequest $request, HomeSection $homeSection)
    {
        $data = $request->except(['image','bg_image']);
        if ($request->file('image')){
            $img = $this->uploadPhoto($request->file('image'),'homeSection');
            $data +=[
                'image'=>$img,
            ];
        }
        if ($request->bg_type==2){
            if ($request->file('bg_image')){
                $video = $this->uploadPhoto($request->file('bg_image'),'homeSection/bg');
                $data +=[
                    'bg_image'=>$video,
                ];
            }
        }
        $request->validated();
        $homeSection->update($data);
        Cache::forget('homeSections');
        return new HomeSectionResource($homeSection);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\HomeSection $homeSection
     * @return JsonResponse
     */
    public function destroy(Request $request, HomeSection $homeSection)
    {
        $homeSection->delete();
        Cache::forget('homeSections');
        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(HomeSection $homeSection): JsonResponse
    {
        try {
            $homeSection->update(['is_active' => !$homeSection->is_active]);
            Cache::forget('homeSections');
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
    public function positionUpdate(Request $request)
    {
        Validator::make($request->all(),[
            'ids'=>'required|not_in:0|exists:home_sections,id'
        ])->validate();
        foreach ($request->ids as $key=>$id){
            HomeSection::where(['id'=>$id])->update(['position'=>$key]);
        }
        Cache::forget('homeSections');
        return response()->json(['status'=>'success','message'=>'Successfully position updated'],200);
    }
}
