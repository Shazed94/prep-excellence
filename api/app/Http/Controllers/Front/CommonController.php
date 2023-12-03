<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Http\Requests\TutoringRequestStoreRequest;
use App\Http\Resources\CourseCategoryCollection;
use App\Models\ContactUs;
use App\Models\CourseCategory;
use App\Models\TutoringFee;
use App\Models\TutoringRequest;
use App\Traits\CommonTrait;
use Illuminate\Http\Request;

class CommonController extends Controller
{

    use CommonTrait;

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\TutoringRequestStoreRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function tutoringStore(TutoringRequestStoreRequest $request)
    {
        $data = $request->validated();
        $data += $this->storeMetadata($request);
        $cn = TutoringRequest::create($data);
        if (isset($cn->id)) return response()->json(['status'=>'success','message'=>'Thank you for contacting with us'],200);
        else return response()->json(['status'=>'error','message'=>'Invalid request try again'],404);
    }


    public function courseCategories()
    {
        $categories = CourseCategory::where(['is_active'=>1])->get(['id','name']);
        return new CourseCategoryCollection($categories);
    }

    public function tutoringHourlyRate(Request $request)
    {
        $fee = TutoringFee::where(['is_active'=>1])->first();
        return response()->json(['data'=>$fee],200);
    }

}
