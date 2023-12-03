<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SiblingUpdateRequest extends FormRequest
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
            'student_id' => ['integer', 'exists:students,id'],
            'sibling_id' => ['integer', 'exists:siblings,id'],
            'is_active' => ['required'],
            'created_by' => [''],
            'updated_by' => [''],
            'ip' => ['string', 'max:50'],
            'browser' => ['string'],
            'softdeletes' => ['required'],
        ];
    }
}
