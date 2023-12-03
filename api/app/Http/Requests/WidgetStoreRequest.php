<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WidgetStoreRequest extends FormRequest
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
            'placement' => ['nullable','max:100'],
            'title' => ['required','max:100'],
            'type' => ['required','max:100'],
            'text' => [],
            'p_menu_id' => ['nullable','integer'],
            'position' => ['nullable','integer'],
        ];
    }
}
