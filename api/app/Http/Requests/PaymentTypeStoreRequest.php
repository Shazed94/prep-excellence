<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaymentTypeStoreRequest extends FormRequest
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
//            'name' => ['string', 'unique:payment_types,name', 'max:191'],
            'name' => ['string', 'max:191', Rule::unique('payment_types', 'name')
                ->where(function ($query) {
                    return $query->whereNull('deleted_at');
                })
            ],
            'details' => ['nullable', 'string'],
            'is_active' => [''],
            'created_by' => [''],
            'updated_by' => [''],
            'ip' => ['string', 'max:50'],
            'browser' => ['string'],
        ];
    }
}
