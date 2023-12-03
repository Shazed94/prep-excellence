<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BankAccountUpdateRequest extends FormRequest
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
        $id = $this->bank_account->id;
        return [
            'title' => ['required', 'string', 'max:191', 'unique:bank_accounts,title,' . $id],
            'bank_id' => ['integer', 'exists:banks,id'],
            'account_no' => ['string', 'max:100','alpha_num']
        ];
    }
}
