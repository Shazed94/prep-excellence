<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TestimonialStoreRequest extends FormRequest
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
            'first_name' => ['required','string','max:191'],
            'last_name' => ['required','string','max:191'],
            'email' => ['required','email','max:191'],
            'phone_number' => ['required','string','max:40'],
            'message' => ['required'],
            'image' => ['image','mimes:jpg,png,jpeg'],
        ];
    }
}
