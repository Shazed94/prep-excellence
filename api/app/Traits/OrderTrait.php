<?php

namespace App\Traits;

use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Course;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\StudentCourse;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

trait OrderTrait
{
    use CommonTrait;
    protected function getCarts($ids)
    {
        /*$session_id = session()->getId();

        $cart = Cart::query();
        $cart->whereHas('Course', function ($p) {
            $p->where('is_active', 1)->where('deleted_at', null);
        });
        if (auth()->check()) {
            $cart->where('user_id', auth()->user()->id);
        } else {
            $cart->where('session_id', $session_id);
        }
        $cart = $cart->latest('id')->get();

        return $cart;*/
        return Course::whereIn('id',$ids)->where(['is_active'=>1])->whereDate('end_date','>=',Carbon::today())->get();
    }
    /*
     * method for get question qualities
     * */
    protected function chkCoupon($code,$ids,$carts=[],$coupon_id=false)
    {
        $minutes = 15;
        $product_total = 0;

        // Check Use
        $order = Order::where('user_id', auth()->user()->id)->where('coupon_code', $code)->first();

        if (isset($order->id)) {
            return [
                'status' => false,
                'text' => 'You have already used this coupon!'
            ];
        }
        if(count($carts) <1 )$carts = $this->getCarts($ids);
        foreach ($carts as $cart) {
            $product_total +=  $cart->amount;
        }
        if ($coupon_id) $coupon = Coupon::where('id', $code)->where('status', 1)->first();
        else $coupon = Coupon::where('code', $code)->where('status', 1)->first();

        if ($coupon) {
            // Check user
            if ($coupon->user_id) {
                if (!auth()->check()) {
                    cookie()->queue('coupon', null, $minutes);
                    return [
                        'status' => false,
                        'text' => 'You are not allow to use this coupon!'
                    ];
                }

                if ($coupon->user_id != auth()->user()->id) {
                    cookie()->queue('coupon', null, $minutes);
                    return [
                        'status' => false,
                        'text' => 'You are not allow to use this coupon!'
                    ];
                }
            }

            // Check Use
            if ($coupon->maximum_use && $coupon->maximum_use <= $coupon->used) {
                cookie()->queue('coupon', null, $minutes);

                return [
                    'status' => false,
                    'text' => 'The coupon is not available!'
                ];
            }

            // Check date
            if ($coupon->expiry_date) {
                if ($coupon->expiry_date < Carbon::now()) {
                    cookie()->queue('coupon', null, $minutes);
                    return [
                        'status' => false,
                        'text' => 'Your coupon has expired!'
                    ];
                }
            }

            // Check minimum spent
            if ($coupon->minimum_spend) {
                if ($product_total < $coupon->minimum_spend) {
                    $minimum_string = '$' . $coupon->minimum_spend;
                    cookie()->queue('coupon', null, $minutes);
                    return [
                        'status' => false,
                        'text' => "Product price must be getter then or equal $minimum_string to use this coupon!"
                    ];
                }
            }

            // Check maximum spent
            if ($coupon->maximum_spend) {
                if ($product_total > $coupon->maximum_spend) {
                    $maximum_string = '$' . $coupon->maximum_spend;
                    cookie()->queue('coupon', null, $minutes);
                    return [
                        'status' => false,
                        'text' => "Product price must be lower then or equal $maximum_string to use tis coupon!"
                    ];
                }
            }

            $amount = $coupon->discount;

            // Cookie::queue('coupon', $code, $minutes);
            if ($coupon->type == 'Fixed') {
                $discount = $amount;
            } else {
                $discount =  ($product_total * $amount) / 100;
            }
            return [
                'status' => true,
                'text' => 'Coupon applied successful.',
                'discount' => $discount,
                'only_discount' => $amount,
                'coupon' => $coupon
            ];
        }

        cookie()->queue('coupon', null, $minutes);
        return [
            'status' => false,
            'text' => 'Coupon is not active!'
        ];
    }

    protected function finalOrderMake($ids,$tnx_id,$payment_method='strip',$coupon_id=null){
        DB::beginTransaction();
        try {
            $courses = $this->getCarts($ids);
            if ($coupon_id) $ck_coupon = $this->chkCoupon($coupon_id,$ids,$courses,true);
            $amount = $courses->sum('amount');
            $discount =0;
            $discount_amount =0;
            $coupon=null;
            if(isset($ck_coupon) && $ck_coupon['status']) {
                $discount_amount = $ck_coupon['discount'];
                $discount = $ck_coupon['only_discount'];
                $coupon= $ck_coupon['coupon'];
            }
            $order =[
                'status'=>'Pending',
                'payment_status'=>'Unpaid',
                'user_id'=>auth()->id(),
                'product_total'=>$amount,
                'tax'=>0,
                'tax_amount'=>0,
                'other_cost'=>0,
                'discount'=>$discount,
                'discount_amount'=>$discount_amount,
                'payment_method'=>$payment_method,
                'payment_transaction_id'=>$tnx_id,
                'coupon_id'=>$coupon?$coupon->id:null,
                'coupon_code'=>$coupon?$coupon->code:null,
            ];
            $order = Order::create($order);
            $std_id = auth()->user()->userable->id;
            //$studentCourse=[];
            foreach ($courses as $course) {
                $studentCourse=[
                    'student_id'=> $std_id,
                    'course_id'=> $course->id,
                    'order_id'=> $order->id,
                    'amount'=> $course->amount,
                    //'created_at'=> now(),
                    //'updated_at'=> now(),
                ];
                StudentCourse::create($studentCourse);
            }
            //StudentCourse::insert($studentCourse);
            DB::commit();
            return [
                'status'=>true,
                'data'=>$order
            ];
        }catch (\Exception $e){
            DB::rollback();
            return [
                'status'=>false,
                'data'=>null
            ];
        }

    }
    protected function orderPayment($id, $amount, $gateway_order_id, $txn_number,$receipt_url=null, $note = null, $refund_order_id = null){
        $order_payment = new OrderPayment();
        $order_payment->order_id = $id;
        $order_payment->amount = $amount;
        $order_payment->gateway_order_id = $gateway_order_id;
        $order_payment->txn_number = $txn_number;
        $order_payment->refund_order_id = $refund_order_id;
        $order_payment->note = $note;
        $order_payment->receipt_url = $receipt_url;
        $order_payment->save();

        return $order_payment;
    }

}
