<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactUsRequest extends FormRequest
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
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'first_name'=>['required', 'string', 'max:191'],
            'last_name'=>['required', 'string', 'max:191'],
            'email'=>['required', 'email', 'max:60'],
            'phone_number'=>['required', 'string', 'max:30'],
            'state_or_region'=>['required', 'string', 'max:191'],
            'country'=>['required', 'string', 'max:191'],
            'student_grade'=>['required', 'string', 'max:191'],
            'course'=>['required'],
            'other'=>['nullable', 'string', 'max:191'],
            'day_time'=>['required', 'string', 'max:191'],
            'message'=>['required'],
            //'captcha' => ['required','captcha']
        ];
    }
}
