<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BankAccountStoreRequest extends FormRequest
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
            'title' => ['required','string', 'max:191', Rule::unique('bank_accounts', 'title')
                ->where(function ($query) {
                    return $query->whereNull('deleted_at');
                })
            ],
            'bank_id' => ['required','integer', 'exists:banks,id'],
            'account_no' => ['nullable','string', 'max:100','alpha_num'],
        ];
    }
}
