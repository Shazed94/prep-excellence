<?php

namespace App\Http\Controllers;

use App\Http\Requests\PromotionStoreRequest;
use App\Http\Requests\PromotionUpdateRequest;
use App\Http\Resources\PromotionCollection;
use App\Http\Resources\PromotionResource;
use App\Http\Resources\TestimonialCollection;
use App\Models\Promotion;
use App\Traits\FileUploadTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    use FileUploadTrait, ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\PromotionCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $promotions = Promotion::query();
        if ($search) {
            $promotions->whereLike(['first_name','last_name','email'], $search);
        }
        $promotions = $promotions->orderBy('position','ASC')->paginate($itemsPerPage);

        return new PromotionCollection($promotions);
    }

    /**
     * @param \App\Http\Requests\PromotionStoreRequest $request
     * @return \App\Http\Resources\PromotionResource
     */
    public function store(PromotionStoreRequest $request)
    {
        $data = $request->except(['image']);
        if ($request->file('image')){
            $img = $this->uploadPhoto($request->file('image'),'promotion/');
            $data +=[
                'image'=>$img,
            ];
        }
        $request->validated();
        $promotion = Promotion::create($data);

        return new PromotionResource($promotion);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Slider $slider
     * @return PromotionResource
     */
    public function show(Request $request, Promotion $promotion)
    {
        return new PromotionResource($promotion);
    }

    /**
     * @param \App\Http\Requests\PromotionUpdateRequest $request
     * @param \App\Models\Slider $slider
     * @return \App\Http\Resources\PromotionResource
     */
    public function update(PromotionUpdateRequest $request, Promotion $promotion)
    {
        $data = $request->except(['image']);
        if ($request->file('image')){
            $img = $this->uploadPhoto($request->file('image'),'promotion/');
            $data +=[
                'image'=>$img,
            ];
        }
        $request->validated();
        $promotion->update($data);

        return new PromotionResource($promotion);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Promotion $promotion
     * @return JsonResponse
     */
    public function destroy(Request $request, Promotion $promotion)
    {
        $promotion->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(Promotion $promotion): JsonResponse
    {
        try {
            $promotion->update(['status' => !$promotion->status]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
    public function export(Request $request)
    {
        $cols = ['image', 'title','button_text','button_url','description'];
        $headers = ['image', 'title','button_text', 'button_url','description'];
        $total=[];
        $where=[];
        $template='exporter.commonTablePdf2';
        return $this->commonDataExporter('Promotion', $cols, $headers,$total,$where,$template);

    }

}
