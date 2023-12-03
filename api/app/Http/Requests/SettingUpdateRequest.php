<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SettingUpdateRequest extends FormRequest
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
            'group' => ['required','string', 'max:100'],
            'title' => ['string', 'max:100'],
            'slogan' => ['string', 'max:100'],
            'number' => ['string', 'max:100'],
            'email' => ['email', 'max:100'],
            'tel' => ['string', 'max:100'],
            'copyright' => ['string', 'max:100'],
            'city' => ['string', 'max:100'],
            'state' => ['string', 'max:100'],
            'country' => ['string', 'max:100'],
            'zip' => ['max:100'],
            'street' => ['max:100'],
            'logo' => ['string', 'max:100'],
            'favicon' => ['string', 'max:100'],
            'og_image' => ['string', 'max:100'],
            'facebook' => ['string', 'max:100'],
            'twitter' => ['string', 'max:100'],
            'youtube' => ['string', 'max:100'],
            'instagram' => ['string', 'max:100'],
            'linkedin' => ['string', 'max:100'],
        ];
    }
}
