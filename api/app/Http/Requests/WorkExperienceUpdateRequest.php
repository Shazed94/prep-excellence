<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WorkExperienceUpdateRequest extends FormRequest
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
            'employee_id' => ['integer', 'exists:employees,id'],
            'institute' => ['string', 'max:100'],
            'designation' => ['string', 'max:100'],
            'number_of_year' => ['integer'],
            'is_working' => ['required'],
            'is_active' => ['required'],
            'created_by' => [''],
            'updated_by' => [''],
            'ip' => ['string', 'max:50'],
            'browser' => ['string'],
            'softdeletes' => ['required'],
        ];
    }
}
