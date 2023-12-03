<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdvisorStoreRequest extends FormRequest
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
            'name' => ['required','string', 'max:191'],
            'image' => ['required','image', 'mimes:jpg,png,jpeg'],
            'designation' => ['nullable','string', 'max:191'],
            'email' => ['nullable','email', 'max:191'],
            'phone_number' => ['nullable','string', 'max:100'],
            'short_description' => ['nullable','string'],
            'description' => ['nullable','string'],
        ];
    }
}
