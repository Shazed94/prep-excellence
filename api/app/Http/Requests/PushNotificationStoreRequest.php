<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PushNotificationStoreRequest extends FormRequest
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
            'role_ids' => ['not_in:0', 'exists:roles,id'],
            'subject' => ['string', 'max:191'],
            'message' => ['required'],
            'notifications' => ['required','min:1','max:3'],
        ];
    }
}
