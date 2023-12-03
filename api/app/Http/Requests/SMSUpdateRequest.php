<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SMSUpdateRequest extends FormRequest
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
            'msisdn' => ['string', 'max:30'],
            'text' => ['string'],
            'csms_id' => ['string', 'max:191'],
            'sms_type' => ['string', 'max:20'],
            'status' => ['string', 'max:100'],
            'try' => ['required', 'integer'],
            'is_sent' => ['required', 'integer'],
            'info' => ['json'],
            'softdeletes' => ['required'],
        ];
    }
}
