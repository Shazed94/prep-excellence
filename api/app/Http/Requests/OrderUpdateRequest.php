<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'status' => ['string', 'max:60'],
            'admin_read' => ['required'],
            'payment_status' => ['string', 'max:30'],
            'user_id' => ['integer', 'exists:users,id'],
            'product_total' => ['required', 'integer'],
            'tax' => ['required', 'integer'],
            'tax_amount' => ['required', 'integer'],
            'other_cost' => ['required', 'integer'],
            'discount' => ['required', 'integer'],
            'discount_amount' => ['required', 'integer'],
            'payment_method' => ['string', 'max:60'],
            'payment_transaction_id' => ['string', 'max:191'],
            'refund_other_charge' => ['required', 'integer'],
            'refund_product_total' => ['required', 'integer'],
            'refund_tax_amount' => ['required', 'integer'],
            'refund_total_amount' => ['required', 'integer'],
            'coupon_id' => ['integer', 'exists:coupons,id'],
            'coupon_code' => ['string', 'max:191'],
            'note' => ['string'],
            'staff_note' => ['string'],
            'reference_no' => ['string', 'max:191'],
            'attachment' => ['string', 'max:191'],
            'softdeletes' => ['required'],
        ];
    }
}
