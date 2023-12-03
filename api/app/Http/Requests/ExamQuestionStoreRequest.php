<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExamQuestionStoreRequest extends FormRequest
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
            'question_bank_id' => ['integer', 'exists:question_banks,id'],
            'exam_id' => ['required','integer', 'exists:exams,id'],
            'question_type' => ['required', 'integer'],
            'question_part' => ['nullable', 'integer'],
            'question' => ['nullable'],
            'options' => ['json','nullable'],
            'answer' => ['nullable'],
            'mark' => ['required', 'numeric'],
        ];
    }
}
