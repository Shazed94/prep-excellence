<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MenuItemUpdateRequest extends FormRequest
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
            'p_menu_id' => ['required','integer', 'exists:p_menus,id'],
            'name' => ['max:100'],
            'url' => ['max:100'],
            'relation_id' => ['not_in:0'],
            'relation_with' => ['max:100'],
            'menu_item_id' => ['integer'],
        ];
    }
}
