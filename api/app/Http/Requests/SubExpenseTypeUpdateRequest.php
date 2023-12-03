<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubExpenseTypeUpdateRequest extends FormRequest
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
        $id = $this->sub_expense_type->id;
        return [
            'name' => ['required', 'string', 'max:191', 'unique:sub_expense_types,name,' . $id],
            'expense_type_id' => ['integer']
        ];
    }
}
