<?php

namespace App\Http\Controllers;

use App\Http\Requests\TutoringStoreRequest;
use App\Http\Requests\TutoringUpdateRequest;
use App\Http\Resources\TutoringCollection;
use App\Http\Resources\TutoringResource;
use App\Models\Tutoring;
use App\Models\TutoringFee;
use App\Traits\CommonTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TutoringController extends Controller
{
    use CommonTrait, ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $tutoring = Tutoring::query();
        $tutoring->where('is_paid', 1);
        if ($search) {
            $tutoring->whereLike(['user.name','user.email','user.phone_number'], $search);
        }
        $tutoring = $tutoring->with(['user'])->orderBy('id','DESC')->paginate($itemsPerPage);
        return TutoringResource::collection($tutoring);
    }

    /**
     * @param \App\Http\Requests\TutoringStoreRequest $request
     * @return \App\Http\Resources\TutoringResource
     */
    public function store(TutoringStoreRequest $request)
    {
        $data = $request->validated();
        $cc = json_decode($data['courses'],false);
        $hour = collect($cc)->sum('hour');
        $rate = $hour >=4 ? 49 : 59;
        $amount = $hour * $rate;
        $data +=[
            'total_hour'=>$hour,
            'hour_rate'=>$rate,
            'amount'=>$amount,
            'total_amount'=>$amount,
        ];

        $data += $this->storeMetadata($request);
        $tutoringRequest = Tutoring::create($data);

        return new TutoringResource($tutoringRequest);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Tutoring $tutoringRequest
     * @return \App\Http\Resources\TutoringResource
     */
    public function show(Request $request, Tutoring $tutoringRequest)
    {
        return new TutoringResource($tutoringRequest);
    }

    /**
     * @param \App\Http\Requests\TutoringUpdateRequest $request
     * @param \App\Models\Tutoring $tutoringRequest
     * @return \App\Http\Resources\TutoringResource
     */
    public function update(TutoringUpdateRequest $request, Tutoring $tutoring)
    {
        $tutoring->update($request->validated());

        return new TutoringResource($tutoring);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Tutoring $tutoringRequest
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Tutoring $tutoring)
    {
        $tutoring->delete();

        return response()->noContent();
    }

    public function export(Request $request)
    {
        $cols = ['user.name','user.phone_number','other', 'student_need','day_time','day_time_tutoring','referral','question', 'total_hour','amount'];
        $headers = ['Name','Phone Number','other', 'student_need','day_time','day_time_tutoring','referral','question', 'total_hour','amount'];
        $total=['total_hour','amount'];
        return $this->commonDataExporter('Tutoring', $cols, $headers,$total);
    }

    public function tutoringFeeStoreOrUpdate(Request $request)
    {
        $data = Validator::make($request->all(),[
                'hour_rate'=>'required|not_in:0|numeric|min:1|max:1000',
                'hour_rate_after'=>'nullable|not_in:0|numeric|min:1|max:1000',
                'hour_rate2'=>'nullable|not_in:0|numeric|min:1|max:1000',
        ])->validate();

        $fee = TutoringFee::where(['is_active'=>1])->first();
        if (isset($fee->id)){
            $fee->update($data+ $this->updateMetadata($request));
        }else{
            $fee = TutoringFee::create($data+ $this->storeMetadata($request));
        }
        return response()->json(['data'=>$fee],200);
    }

    public function tutoringHourlyRate(Request $request)
    {
        $fee = TutoringFee::where(['is_active'=>1])->first();
        return response()->json(['data'=>$fee],200);
    }
}
