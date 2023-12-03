<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TutoringRequestUpdateRequest extends FormRequest
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
            'parent_name' => ['required','string', 'max:191'],
            'email' => ['required','email', 'max:60'],
            'phone_number' => ['required','string', 'max:30'],
            'student_name' => ['required','string', 'max:191'],
            'student_school' => ['required','string', 'max:191'],
            'student_grade' => ['required','string', 'max:191'],
            'student_phone' => ['required','string', 'max:30'],
            'student_email' => ['required','string', 'max:60'],
            'course' => ['required','json'],
            'other' => ['nullable','string', 'max:191'],
            'student_need' => ['required','string'],
            'day_time' => ['required','string', 'max:191'],
            'day_time_tutoring' => ['required','string', 'max:191'],
            'referral' => ['nullable','string', 'max:191'],
            'question' => ['nullable','string'],
        ];
    }
}
