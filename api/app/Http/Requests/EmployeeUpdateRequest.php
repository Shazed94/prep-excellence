<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeUpdateRequest extends FormRequest
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
            'role_id' => ['required','not_in:0', 'max:100', 'exists:roles,id'],
            'designation_id' => ['nullable','integer', 'exists:designations,id'],
            //'employee_id' => ['string', 'max:100', 'unique:employees,employee_id'],
            'first_name' => ['required','string','max:191'],
            'last_name' => ['nullable','string','max:191'],
            'email' => ['required','email','max:191'],
            'phone_number' => ['nullable','max:191'],
            'image' => ['nullable','image','mimes:jpg,png,jpeg'],
            'gender_id' => ['nullable','not_in:0', 'max:100', 'exists:genders,id'],
            'blood_group_id' => ['nullable','not_in:0', 'max:100', 'exists:blood_groups,id'],
            'religion_id' => ['nullable','not_in:0', 'max:100', 'exists:religions,id'],
            'marital_status_id' => ['nullable','integer', 'exists:marital_statuses,id'],
            //'hour_rate' => ['required','numeric','not_in:-1'],
            //'salary_monthly' => ['nullable','numeric','not_in:-1'],
            'father_name' => ['max:100'],
            'mother_name' => ['max:100'],
            'join_date' => ['nullable','date'],
            'nid' => ['nullable','string', 'max:100', 'unique:employees,nid,'.$this->employee->id],
            'emergency_contact' => ['nullable','max:100'],
            'present_address' => [''],
            'permanent_address' => [''],
            'employee_qualifications' => ['nullable','json'],
            'work_experiences' => ['nullable','json'],
            'short_biography' => ['nullable'],
            'biography' => ['nullable'],
        ];
    }
}
