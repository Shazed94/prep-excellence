<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExamStoreRequest extends FormRequest
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
            'title' => ['required','max:191'],
            'course_id' => ['required','integer', 'exists:courses,id'],
            'time_type' => ['required','integer',],
            'exam_start_date' => ['nullable','date'],
            'exam_end_date' => ['nullable','date'],
            'exam_start' => ['nullable','after_or_equal:'. date('Y-m-d H:i:s')],
            'exam_end' => ['nullable','after:exam_start'],
            'duration' => ['required', 'numeric'],
            'exam_type' => ['required', 'integer'],
            'sat_section_id' => ['nullable', 'not_in:0','exists:sat_sections,id'],
            'question_type' => ['nullable','integer'],
            'question_file' => ['nullable','mimes:pdf'],
            'question' => ['nullable','string'],
            //'employee_id' => ['integer', 'exists:employees,id'],
        ];
    }
}
