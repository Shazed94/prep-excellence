<?php

namespace App\Http\Controllers;

use App\Http\Requests\TestimonialStoreRequest;
use App\Http\Requests\TestimonialUpdateRequest;
use App\Http\Resources\SliderResource;
use App\Http\Resources\TestimonialCollection;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use App\Traits\FileUploadTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    use FileUploadTrait,ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\TestimonialCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $testimonial = Testimonial::query();
        if ($search) {
            $testimonial->whereLike(['first_name','last_name','email'], $search);
        }
        $testimonial = $testimonial->orderBy('position','ASC')->paginate($itemsPerPage);

        return new TestimonialCollection($testimonial);
    }

    /**
     * @param \App\Http\Requests\TestimonialStoreRequest $request
     * @return \App\Http\Resources\SliderResource
     */
    public function store(TestimonialStoreRequest $request)
    {
        $data = $request->except(['image']);
        if ($request->file('image')){
            $img = $this->uploadFile($request->file('image'),'testimonial');
            $data +=[
                'image'=>$img,
            ];
        }
        $request->validated();
        $testimonial = Testimonial::create($data);

        return new SliderResource($testimonial);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Slider $slider
     * @return TestimonialResource
     */
    public function show(Request $request, Testimonial $testimonial)
    {
        return new TestimonialResource($testimonial);
    }

    /**
     * @param \App\Http\Requests\TestimonialUpdateRequest $request
     * @param \App\Models\Slider $slider
     * @return \App\Http\Resources\TestimonialResource
     */
    public function update(TestimonialUpdateRequest $request, Testimonial $testimonial)
    {
        $data = $request->except(['image']);
        if ($request->file('image')){
            $img = $this->uploadFile($request->file('image'),'testimonial');
            $data +=[
                'image'=>$img,
            ];
        }
        $request->validated();
        $testimonial->update($data);

        return new TestimonialResource($testimonial);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Testimonial $testimonial
     * @return JsonResponse
     */
    public function destroy(Request $request, Testimonial $testimonial)
    {
        $testimonial->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(Testimonial $testimonial): JsonResponse
    {
        try {
            $testimonial->update(['status' => !$testimonial->status]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }

    public function export(Request $request)
    {
        $cols = ['image', 'name','email','phone_number','message','created_at'];
        $headers = ['Image', 'Name','email','phone number','message','Date'];
        $total=[];
        $where=[];
        $template='exporter.commonTablePdf2';
        return $this->commonDataExporter('Testimonial', $cols, $headers,$total,$where,$template);

    }

}
