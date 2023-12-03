<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StudentAnswerStoreRequest extends FormRequest
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
            'student_id' => ['integer', 'exists:students,id'],
            'exam_id' => ['required','integer', 'exists:exams,id'],
            'exam_question_id' => ['required','integer', 'exists:exam_questions,id'],
            'student_answer' => ['required',],
            'correct_answer' => ['nullable'],
            'total_mark' => ['nullable', 'numeric'],
            'mark' => ['nullable', 'numeric'],
        ];
    }
}
