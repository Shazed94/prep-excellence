<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GalleryItemUpdateRequest extends FormRequest
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
            'gallery_id' => ['required','integer', 'exists:galleries,id'],
            'type' => ['required', 'integer'],
            'image' => ['max:100'],
            'video' => ['max:100'],
            'embedded_code' => [],
        ];
    }
}
