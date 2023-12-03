<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StudentHomeWorkUpdateRequest extends FormRequest
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
            'home_work_id' => ['required','integer', 'exists:home_works,id'],
            'student_id' => ['required','integer', 'exists:students,id'],
            'file' => ['string', 'max:100'],
            'submission_type' => ['string', 'max:100'],
            'mark' => ['required', 'numeric'],
            'total_mark' => ['required', 'numeric'],
        ];
    }
}
