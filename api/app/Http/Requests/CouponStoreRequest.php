<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CouponStoreRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:191'],
            'type' => ['required', 'string', 'max:191'],
            'code' => ['required', 'string', 'max:60','unique:coupons,code'],
            'limit' => ['nullable','integer','min:1'],
            'used' => ['nullable','integer','min:01'],
            'discount' => ['required','numeric','min:1'],
            'expiry_date' => ['required','nullable','after_or_equal:now'],
            'minimum_spend' => ['nullable','numeric','min:0'],
            'maximum_spend' => ['nullable','numeric','min:0'],
            'user_id' => ['nullable','integer','not_in:0','exists:users,id'],
            'status' => ['integer','not_in:-1'],
        ];
    }
}
