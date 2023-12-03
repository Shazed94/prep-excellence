<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CourseMaterialStoreRequest extends FormRequest
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
            'type' => ['required', 'integer'],
            'file' => ['required'],
            'video' => [],
            'employee_id' => ['exists:employees,id'],
            'expire_date' => ['required','date'],
        ];
    }
}
