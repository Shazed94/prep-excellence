<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TutoringUpdateRequest extends FormRequest
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
            'user_id' => ['nullable'],
            'courses' => ['required','json'],
            'other' => ['nullable','string', 'max:191'],
            'student_need' => ['required','string'],
            'day_time' => ['required','string', 'max:191'],
            'day_time_tutoring' => ['required','string', 'max:191'],
            'referral' => ['nullable','string', 'max:191'],
            'question' => ['nullable','string'],
        ];
    }
}
