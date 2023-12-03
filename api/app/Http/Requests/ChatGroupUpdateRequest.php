<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChatGroupUpdateRequest extends FormRequest
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
            'name' => ['string', 'max:191'],
            'description' => ['string'],
            'image' => ['string', 'max:100'],
            'is_active' => ['required'],
            'ip' => ['string', 'max:50'],
            'browser' => ['string'],
            'softdeletes' => ['required'],
        ];
    }
}
