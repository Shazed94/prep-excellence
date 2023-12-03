<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StudentCourseUpdateRequest extends FormRequest
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
            'student_id' => ['required','integer', 'exists:students,id'],
            'course_id' => ['required','integer', 'exists:courses,id'],
            'amount' => ['required', 'numeric','not_in:-1','min:1'],
            'payment_status' => ['string', 'max:100'],
            'payment_type' => ['string', 'max:100'],
            'transaction_no' => ['string', 'max:100'],
            'payment_details' => ['string'],
        ];
    }
}
