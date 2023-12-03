<?php

namespace App\Http\Controllers;

use App\Http\Requests\CouponStoreRequest;
use App\Http\Requests\CouponUpdateRequest;
use App\Http\Resources\CouponCollection;
use App\Http\Resources\CouponResource;
use App\Models\Coupon;
use App\Traits\FileUploadTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    use FileUploadTrait,ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return CouponCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 10;
        $search = request('search');
        $blogs = Coupon::query();
        if ($search) {
            $blogs->whereLike(['title', 'type', 'code', 'limit', 'used', 'discount', 'expiry_date',
                'minimum_spend', 'maximum_spend'], $search);
        }
        $blogs = $blogs->orderBy('id',"DESC")->paginate($itemsPerPage);
        return new CouponCollection($blogs);
    }

    /**
     * @param \App\Http\Requests\CouponStoreRequest $request
     * @return CouponResource
     */
    public function store(CouponStoreRequest $request)
    {
        $data = $request->validated();

        $data +=[
            'status'=>1,
            //'user_id'=>auth()->id(),
        ];

        $coupon = Coupon::create($data);

        return new CouponResource($coupon);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Coupon $coupon
     * @return \App\Http\Resources\CouponResource
     */
    public function show(Request $request, Coupon $coupon)
    {
        return new CouponResource($coupon);
    }

    /**
     * @param \App\Http\Requests\CouponUpdateRequest $request
     * @param \App\Models\Coupon $coupon
     * @return \App\Http\Resources\CouponResource
     */
    public function update(CouponUpdateRequest $request, Coupon $coupon)
    {
        $data = $request->validated();
        $coupon->update($data);

        return new CouponResource($coupon);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Coupon $coupon
     * @return JsonResponse
     */
    public function destroy(Request $request, Coupon $coupon)
    {
        $coupon->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(Coupon $coupon): JsonResponse
    {
        try {
            $coupon->update(['status' => !$coupon->status]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }

    public function export(Request $request)
    {
        $cols = ['title','type','code','limit','used','discount',
            'expiry_date','minimum_spend','maximum_spend','user_id','status'];
        $headers = ['title','type','code','limit','used','discount',
            'expiry_date','minimum_spend','maximum_spend','user_id','status'];
        $total=[];
        $where=[];
        $template='exporter.commonTablePdf2';
        return $this->commonDataExporter('Coupon', $cols, $headers,$total,$where,$template);

    }
}
