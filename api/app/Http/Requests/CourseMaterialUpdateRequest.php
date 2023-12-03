<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CourseMaterialUpdateRequest extends FormRequest
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
            'expire_date' => ['required','date'],
            'type' => ['required','integer'],
            'file' => [],
            'video' => [],
            'employee_id' => ['integer', 'exists:employees,id'],
        ];
    }
}
