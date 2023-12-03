<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeePaymentUpdateRequest extends FormRequest
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
            'invoice_no' => ['string', 'max:191'],
            'employee_id' => ['integer', 'exists:employees,id'],
            'date' => ['date'],
            'regular_hour' => ['required', 'numeric'],
            'ot_hour' => ['required', 'numeric'],
            'total_hour' => ['required', 'numeric'],
            'regular_amount' => ['required', 'numeric'],
            'ot_amount' => ['required', 'numeric'],
            'total_amount' => ['required', 'numeric'],
            'regular_hour_rate' => ['required', 'numeric'],
            'ot_hour_rate' => ['required', 'numeric'],
            'payment_type' => ['string', 'max:191'],
            'note' => ['string'],
            'is_paid' => ['required'],
            'softdeletes' => ['required'],
        ];
    }
}
