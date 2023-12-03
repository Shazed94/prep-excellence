<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class PaymentTypeUpdateRequest extends FormRequest
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
        $id = $this->payment_type->id;
        return [
            'name' => ['string', 'max:191', 'unique:payment_types,name,' . $id],
            'details' => ['nullable','string'],
            'is_active' => [''],
            'created_by' => [''],
            'updated_by' => [''],
            'ip' => ['string', 'max:50'],
            'browser' => ['string'],
        ];
    }
}
