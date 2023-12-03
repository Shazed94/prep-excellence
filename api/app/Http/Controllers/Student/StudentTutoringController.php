<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\TutoringStoreRequest;
use App\Http\Requests\TutoringUpdateRequest;
use App\Http\Resources\TutoringResource;
use App\Models\Student;
use App\Models\Tutoring;
use App\Models\TutoringFee;
use App\Traits\CommonTrait;
use App\Traits\EmailTrait;
use Illuminate\Http\Request;
use Stripe\Stripe;

class StudentTutoringController extends Controller
{
    use CommonTrait,EmailTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $tutoring = Tutoring::query();
        $tutoring->where('user_id',auth()->id());
        $tutoring->where('is_paid',1);
        if ($search) {
            $tutoring->whereLike(['user.name','user.email','user.phone_number','tnx_no'], $search);
        }
        $tutoring = $tutoring->with(['user'])->orderBy('id','DESC')->paginate($itemsPerPage);
        return TutoringResource::collection($tutoring);
    }

    /**
     * @param \App\Http\Requests\TutoringStoreRequest $request
     *
     */
    public function store(TutoringStoreRequest $request)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'You must be login as a student to purchase', 'status' => 'error'],404);
        }
        if (!Student::find(auth()->user()->userable->id)) {
            return response()->json(['message' => 'You must be student to purchase', 'status' => 'error'],404);
        }
        $data = $request->validated();
        $cc = json_decode($data['courses'],false);
        $hour = collect($cc)->sum('hour');

        $fee = TutoringFee::where(['is_active'=>1])->first();
        $rate = 59; //default rate
        if (isset($fee->id)){
            if ($fee->hour_rate_after && $fee->hour_rate2 && $hour > $fee->hour_rate_after){
                $rate = $fee->hour_rate2;
            }else $rate = $fee->hour_rate;
        }
        $amount = $hour * $rate;
        $tnx_number = uniqid();
        $data +=[
            'user_id'=>auth()->id(),
            'tnx_no'=>$tnx_number,
            'total_hour'=>$hour,
            'hour_rate'=>$rate,
            'amount'=>$amount,
            'total_amount'=>$amount,
        ];

        $data += $this->storeMetadata($request);
        $tutoring = Tutoring::create($data);

        return new TutoringResource($tutoring);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Tutoring $tutoringRequest
     * @return \App\Http\Resources\TutoringResource
     */
    public function show(Request $request, Tutoring $tutoring)
    {
        return new TutoringResource($tutoring);
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

    public function payment(Tutoring $tutoring) {

        if ($tutoring->is_paid) return response()->json(['status' => 'error','message'=>'You Already paid'],404);

        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        $line_items = [];
        $tnx = $tutoring->tnx_no;
        foreach (json_decode($tutoring->courses,false) as $item) {
            $temp_items = [
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => $item->name,
                        'images' => [],
                    ],
                    'unit_amount' => number_format($tutoring->hour_rate,2) * 100,
                ],
                'quantity' => $item->hour,
            ];

            $line_items[] = $temp_items;
        }

        $session = \Stripe\Checkout\Session::create([
            'payment_method_types' => ['card'],
            'line_items' => $line_items,
            'mode' => 'payment',
            'success_url' => env('APP_URL') . "/api/tutoring/student/payment/$tnx",
            'cancel_url' => env('FRONTEND_URL') . '/stripe/payment-failed',
        ]);
        return response()->json(['url' => $session->url, 'status' => 'success'],200);
    }

    public function paymentSuccess(Request $request, $tnx)
    {
        $tutoring = Tutoring::where('tnx_no',$tnx)->first();
        $tutoring->update(['is_paid'=>1]);
        try {
            $this->tutoringOrder($tutoring,"New Order #$tnx -".env('APP_NAME'));
        }catch (\Exception $e){
            //
        }
        return redirect()->away(env('FRONTEND_URL') . '/stripe/success');
    }
}
