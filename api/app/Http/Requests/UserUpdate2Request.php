<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserUpdate2Request extends FormRequest
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
            'first_name' => ['required', 'string', 'max:191'],
            'last_name' => ['required', 'string', 'max:191'],
            'email' => ['required','email', 'max:60','unique:users,email,'.auth()->id()],
            'phone_number' => ['required', 'string', 'max:60'],
            'image' => ['nullable', 'image', 'mimes:jpg,png,jpeg,webp'],
        ];
    }
}
