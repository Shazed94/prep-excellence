<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubExpenseTypeStoreRequest extends FormRequest
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
            'name' => ['string', 'max:191', Rule::unique('sub_expense_types', 'name')
                ->where(function ($query) {
                    return $query->whereNull('deleted_at');
                })
            ],
            'expense_type_id' => ['integer']
        ];
    }
}
