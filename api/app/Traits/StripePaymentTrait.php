<?php

namespace App\Traits;
use Illuminate\Support\Facades\Validator;
use Stripe;

trait StripePaymentTrait
{
    protected function stripePay($request,$amount,$currency='usd')
    {
        $data = Validator::make($request->all(),[
            'name'=>'required|max:191',
            'number'=>'required|max:16|min:16',
            'exp_month'=>'required|max:2',
            'exp_year'=>'required|max:4|min:4',
            'cvc'=>'required|max:3|min:3',
        ])->validate();
        $stripe = new \Stripe\StripeClient(
            env('STRIPE_KEY')
        );
        try {
            $stripe = $stripe->tokens->create([
                'card' => [
                    'number' => $data['number'],
                    'exp_month' => $data['exp_month'],
                    'exp_year' => $data['exp_year'],
                    'cvc' => $data['cvc'],
                ],
            ]);
        }catch (\Stripe\Exception\CardException $e){
            return response()->json(['status'=>'fail','message'=>$e->getError()->message],404);
        }

        Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

        $stripe = Stripe\Charge::create ([
            "amount" => $amount * 100,
            "currency" => $currency,
            "source" => $stripe->id,
            "description" => "Order Payment"
        ]);
        return $stripe;
    }
}
