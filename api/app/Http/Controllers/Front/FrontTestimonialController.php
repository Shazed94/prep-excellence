<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Http\Requests\TestimonialStoreRequest;
use App\Http\Resources\SliderResource;
use App\Http\Resources\TestimonialCollection;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use App\Traits\FileUploadTrait;
use Illuminate\Http\Request;

class FrontTestimonialController extends Controller
{
    use FileUploadTrait;
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
        $testimonial = $testimonial->where(['status'=>1])->orderBy('id','DESC')->paginate($itemsPerPage);

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

}
