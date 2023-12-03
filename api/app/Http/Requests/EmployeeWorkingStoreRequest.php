<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeWorkingStoreRequest extends FormRequest
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
            'course_schedule_id' => ['integer', 'exists:course_schedules,id'],
            'employee_id' => ['integer', 'exists:employees,id'],
            'date' => ['date'],
            'working_hour' => ['required', 'numeric'],
            'hour_rate' => ['required', 'numeric'],
            'is_paid' => ['required'],
            'softdeletes' => ['required'],
        ];
    }
}
