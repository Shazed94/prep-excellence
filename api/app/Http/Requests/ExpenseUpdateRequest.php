<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExpenseUpdateRequest extends FormRequest
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
            //'invoice_no' => ['string', 'max:100'],
            'expense_type_id' => ['nullable', 'integer'],
            'sub_expense_type_id' => ['nullable', 'not_in:0','integer'],
            'expense_date' => ['nullable','date'],
            'amount' => ['required', 'numeric','not_in:-1','min:1'],
            'payment_type_id' => ['nullable', 'integer'],
            'bank_account_id' => ['nullable', 'integer'],
            'check_no' => ['nullable', 'string', 'max:100'],
            'check_date' => ['nullable', 'date'],
            'note' => ['nullable', 'string']
        ];
    }
}
