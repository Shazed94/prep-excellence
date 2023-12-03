<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PageStoreRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:191'],
            'slug' => ['nullable','max:191'],
            'short_description' => ['nullable',],
            'description' => ['nullable',],
            'image' => ['nullable','mimes:jpg,png,jpeg,webp'],
            'bread_crumb_image' => ['nullable','mimes:jpg,png,jpeg,webp'],
            'template' => ['nullable','max:100'],
            'service_title' => ['nullable','max:191'],
            'service_sub_title' => ['nullable','max:191'],
            'services' => ['nullable','json'],
        ];
    }
}
