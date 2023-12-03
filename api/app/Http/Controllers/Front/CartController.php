<?php

namespace App\Http\Controllers\Front;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Student;
use App\Traits\EmailTrait;
use App\Traits\OrderTrait;
use App\Traits\PushNotificationTrait;
use App\Traits\StripePaymentTrait;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\StudentCourse;
use App\Http\Controllers\Controller;
//use Cart;


class CartController extends Controller
{
    use PushNotificationTrait, EmailTrait, OrderTrait, StripePaymentTrait;
    public function checkCoupon(Request $request,$coupon)
    {
        $data = Validator::make($request->all(),[
            'ids'=>'nullable'
        ])->validate();
        //return response()->json('working',200);
        return response()->json($this->chkCoupon($coupon,$data['ids']),200);
    }

    public function placeOrder(Request $request) {
        if (auth()->user()->role_id != 3) {
            return response()->json(['message' => 'You must be student to purchase', 'status' => 'error']);
        }
       try {
            $ids = $request->ids;
            $invoice_no = uniqid();
            $rs = $this->finalOrderMake($ids,$invoice_no,'Strip',$request->coupon_id??null);
            if (!$rs['status']) return response()->json(['message' => 'Invalid request try again', 'status' => 'error','data'=>$rs],404);
            $order = $rs['data'];
            if ($order->total <=0) {
                $this->confirmOrder2($order,"New Order #$order->id -".env('APP_NAME'));
                $order->update(['payment_status' => 'paid', 'payment_method' => 'free']);
            }
            return response()->json(['date' =>$order, 'status' => 'success'],200);
        }catch (\Exception $e){
           return response()->json(['message' => 'Invalid request try again', 'status' => 'error'],404);
        }

    }
    public function stripePayment(Request $request, $order_id) {
        $order = Order::where('id',$order_id)->first();
        if ($order->total <=0) {
            $order->update(['payment_status' => 'paid', 'payment_method' => 'free']);
            return response()->json(['status'=>'error','message'=>'Your payment amount is zero dont need to pay'],404);
        }
        if (!isset($order->id)) return response()->json(['status'=>'error','message'=>'Invalid Order'],404);
        if ($order->payment_status=='paid') {
            return response()->json(['status' => 'error', 'message' => 'You are already paid'], 404);
        }
        $response = $this->stripePay($request,$order->total,'usd');
        if ( isset($response->status) && $response->status=='succeeded'){
            $this->orderPayment($order->id, $order->total, $response->id, $response->balance_transaction,$response->receipt_url, 'Order Stripe Payment');
            $order->update(['payment_status'=>'paid']);
            StudentCourse::where('order_id',$order->id)->update(['is_approved'=>1,'payment_status'=>'Paid']);
            //email sent
            $this->confirmOrder2($order,"New Order #$order_id -".env('APP_NAME'));
            return response()->json(['status'=>'success','message'=>'Successfully ordered'],200);
        }else{
            return $response;
        }
    }

    public function orderValidate($order_id)
    {
        $order = Order::where('id',$order_id)->first();
        if ($order->total <=0 && $order->payment_status == 'Unpaid') {
            $order->update(['payment_status' => 'paid', 'payment_method' => 'free']);
            //email sent
            $this->confirmOrder2($order,"New Order #$order_id -".env('APP_NAME'));
            return response()->json(['status'=>'error','message'=>'Your payment amount is zero dont need to pay'],404);
        }
        else if ($order->total <=0) {
            $order->update(['payment_status' => 'paid', 'payment_method' => 'free']);
            return response()->json(['status'=>'error','message'=>'Your payment amount is zero dont need to pay'],404);
        }
        if (!isset($order->id)) return response()->json(['status'=>'error','message'=>'Invalid Order'],404);
        if ($order->payment_status=='paid') return response()->json(['status'=>'error','message'=>'You are already paid'],404);
        return new OrderResource($order);
    }
}
