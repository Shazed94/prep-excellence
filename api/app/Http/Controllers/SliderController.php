<?php

namespace App\Http\Controllers;

use App\Http\Requests\SliderStoreRequest;
use App\Http\Requests\SliderUpdateRequest;
use App\Http\Resources\SliderCollection;
use App\Http\Resources\SliderResource;
use App\Models\Slider;
use App\Traits\FileUploadTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class SliderController extends Controller
{
    use FileUploadTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\SliderCollection
     */
    public function index(Request $request)
    {
        $sliders = Slider::orderBy('position','ASC')->get();

        return new SliderCollection($sliders);
    }

    /**
     * @param \App\Http\Requests\SliderStoreRequest $request
     * @return \App\Http\Resources\SliderResource
     */
    public function store(SliderStoreRequest $request)
    {
        $data = $request->except(['image','video']);
        if ($request->slider_type==1){
            if ($request->file('image')){
                $img = $this->uploadPhoto2($request->file('image'),'slider/',['w'=>1920,'h'=>840]);
                $data +=[
                    'image'=>$img,
                ];
            }
        }elseif ($request->slider_type==2){
            if ($request->file('video')){
                $video = $this->videoUpload($request->file('video'),'slider/video');
                $data +=[
                    'video'=>$video,
                ];
            }
        }
        $request->validated();
        $slider = Slider::create($data);
        Cache::forget('sliders');
        return new SliderResource($slider);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Slider $slider
     * @return \App\Http\Resources\SliderResource
     */
    public function show(Request $request, Slider $slider)
    {
        return new SliderResource($slider);
    }

    /**
     * @param \App\Http\Requests\SliderUpdateRequest $request
     * @param \App\Models\Slider $slider
     * @return \App\Http\Resources\SliderResource
     */
    public function update(SliderUpdateRequest $request, Slider $slider)
    {
        $data = $request->except(['image','video']);
        if ($request->slider_type==1){
            if ($request->file('image')){
                $img = $this->uploadPhoto2($request->file('image'),'slider/',['w'=>1920,'h'=>840]);
                $data +=[
                    'image'=>$img,
                ];
            }
        }elseif ($request->slider_type==2){
            if ($request->file('video')){
                $video = $this->videoUpload($request->file('video'),'slider/video');
                $data +=[
                    'video'=>$video,
                ];
            }
        }
        $request->validated();
        $slider->update($data);
        Cache::forget('sliders');
        return new SliderResource($slider);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Slider $slider
     * @return JsonResponse
     */
    public function destroy(Request $request, Slider $slider)
    {
        $slider->delete();
        Cache::forget('sliders');
        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(Slider $slider): JsonResponse
    {
        try {
            $slider->update(['status' => !$slider->status]);
            Cache::forget('sliders');
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }

    public function positionUpdate(Request $request)
    {
        Validator::make($request->all(),[
            'ids'=>'required|not_in:0|exists:sliders,id'
        ])->validate();
        foreach ($request->ids as $key=>$id){
            Slider::where(['id'=>$id])->update(['position'=>$key]);
        }
        Cache::forget('sliders');
        return response()->json(['status'=>'success','message'=>'Successfully position updated'],200);
    }

}
