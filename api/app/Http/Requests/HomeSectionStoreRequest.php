<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HomeSectionStoreRequest extends FormRequest
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
            'section_design_type_id' => ['required','integer', 'exists:section_design_types,id'],
            'section_name' => ['required', 'string', 'max:191'],
            'section_name_is_show' => ['required'],
            'bg_type' => ['required', 'integer'],
            'bg_image' => ['image'],
            'bg_color' => ['max:100'],
            'col' => ['integer'],
            'row' => ['integer'],
            'title' => ['max:191'],
            'sub_title' => ['max:191'],
            'text_align' => ['integer'],
            'type' => ['integer'],
            'image' => ['max:100'],
            'video' => ['max:100'],
            'video_script' => [],
            'short_description' => [],
            'description' => [],
            'button_name' => ['max:100'],
            'button_url' => ['max:100'],
        ];
    }
}
