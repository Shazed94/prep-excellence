<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SliderUpdateRequest extends FormRequest
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
            'text_1' => ['max:100'],
            'text_2' => ['max:100'],
            'button_1_text' => ['max:100'],
            'button_1_url' => ['max:100'],
            'button_2_text' => ['max:100'],
            'button_2_url' => ['max:100'],
            'short_description' => [],
            'description' => [],
            'slider_type' => ['required', 'integer'],
            'image' => ['image','mimes:jpg,png,jpeg'],
            'video' => ['mimes:mp4'],
            'slider_script' => [],
        ];
    }
}
