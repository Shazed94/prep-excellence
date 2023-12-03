<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CourseScheduleUpdateRequest extends FormRequest
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
            //'course_id' => ['required','integer', 'exists:courses,id'],
            'employee_id' => ['nullable','integer', 'exists:employees,id'],
            'date' => ['required','date'],
            'day' => ['required','string', 'max:100'],
            'start_time' => ['required'],
            'end_time' => ['required'],
            'course_name' => ['required','string','max:191'],
            'classes' => ['required','string','max:191'],
        ];
    }
}
