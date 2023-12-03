<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BlogStoreRequest extends FormRequest
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
            'title' => ['required','string', 'max:100'],
            'short_description' => ['nullable',],
            'description' => ['nullable',],
            'type' => ['required', 'integer'],
            'image' => ['nullable'],
            'video' => ['nullable','max:100'],
            'embedded_code' => ['nullable',],
            'user_id' => ['required','integer', 'exists:users,id'],
            'category_id' => ['nullable','integer', 'exists:categories,id'],
        ];
    }
}
