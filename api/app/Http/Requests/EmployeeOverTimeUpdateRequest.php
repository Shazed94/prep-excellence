<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeOverTimeUpdateRequest extends FormRequest
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
            'employee_id' => ['nullable','integer', 'exists:employees,id'],
            'course_id' => ['nullable','integer', 'exists:courses,id'],
            'date' => ['required','date','before:tomorrow'],
            'working_hour' => ['required', 'numeric','not_in:0','min:1','max:24'],
            'hour_rate' => ['required', 'numeric','not_in:0','min:1','max:1000'],
            'work_type' => ['nullable','string', 'max:191'],
            'note' => ['nullable','string'],
            'status' => ['nullable','integer'],
        ];
    }
}
