<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRequest extends FormRequest
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
            'role_id' => ['required', 'integer', 'exists:roles,id'],
            'userable_type' => ['required', 'string'],
            'userable_id' => ['required', 'integer'],
            'name' => ['required', 'string', 'max:191'],
            'email' => ['required','email', 'max:60','unique:users,email,'.$this->user->id],
            'phone_number' => ['required', 'string', 'max:60'],
            'gender_id' => ['integer', 'exists:genders,id'],
            'blood_group_id' => ['integer', 'exists:blood_groups,id'],
            'religion_id' => ['integer', 'exists:religions,id'],
            'password' => ['required', 'password', 'max:191'],
        ];
    }
}
