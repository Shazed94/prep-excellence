<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeQualificationUpdateRequest extends FormRequest
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
            'employee_id' => ['required','integer', 'exists:employees,id'],
            'exam_name' => ['string', 'max:100'],
            'institute' => ['string', 'max:100'],
            'state' => ['string', 'max:100'],
            'result' => ['string', 'max:100'],
            'out_of_result' => ['string', 'max:100'],
        ];
    }
}
