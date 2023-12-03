<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StudentStoreRequest extends FormRequest
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
            'first_name' => ['required','string','max:191'],
            'last_name' => ['required','string','max:191'],
            'email' => ['required','email','max:191','unique:users,email'],
            'phone_number' => ['nullable','max:191'],
            'image' => ['nullable','image','mimes:jpg,png,jpeg'],
            'gender_id' => ['nullable','not_in:0', 'exists:genders,id'],
            'blood_group_id' => ['nullable','not_in:0', 'exists:blood_groups,id'],
            'religion_id' => ['nullable','not_in:0', 'exists:religions,id'],
            'father_name' => ['nullable','max:100'],
            'guardian_email' => ['nullable','email','max:60'],
            'father_phone_no' => ['nullable','string', 'max:30'],
            'mother_name' => ['nullable','max:100'],
            'present_address' => ['nullable',],
            'parmanent_address' => ['nullable',],
            'roll_no' => ['nullable','integer'],
            'date_of_birth' => ['required','date','before:tomorrow'],
            'parent_id' => ['nullable'],
        ];
    }
}
