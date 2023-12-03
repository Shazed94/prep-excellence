<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryStoreRequest extends FormRequest
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
            'fetcher' => [],
            'fetcher_position' => ['integer'],
            'type' => ['required','integer'],
            'title' => ['required','string', 'max:100'],
            'short_description' => [],
            'description' => [],
            'category_id' => ['integer'],
            'image' => ['max:100'],
        ];
    }
}
