<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HomeWorkUpdateRequest extends FormRequest
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
            'course_id' => ['required','integer', 'exists:courses,id'],
            //'submission_last_date' => ['nullable','date_format:Y-m-d H:i:s'],
            'submission_last_date' => ['nullable','date'],
            'file' => [],
            'employee_id' => ['nullable','integer', 'exists:employees,id'],
            'total_mark' => ['required', 'numeric'],
        ];
    }
}
