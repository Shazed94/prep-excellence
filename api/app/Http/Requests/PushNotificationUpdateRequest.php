<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PushNotificationUpdateRequest extends FormRequest
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
            'user_id' => ['integer', 'exists:users,id'],
            'role_id' => ['integer', 'exists:roles,id'],
            'message' => ['string'],
            'link' => ['string', 'max:191'],
            'is_seen' => ['required'],
            'softdeletes' => ['required'],
        ];
    }
}
