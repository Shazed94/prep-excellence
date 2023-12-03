<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ParentUpdateRequest extends FormRequest
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
            'father_name' => ['string', 'max:100'],
            'father_profession' => ['string', 'max:100'],
            'father_phone_no' => ['required', 'string', 'max:100'],
            'father_nid' => ['string', 'max:100', 'unique:parents,father_nid'],
            'mother_name' => ['string', 'max:100'],
            'mother_profession' => ['string', 'max:100'],
            'mother_phone_number' => ['string', 'max:100'],
            'mother_nid' => ['string', 'max:100', 'unique:parents,mother_nid'],
            'present_address' => ['json'],
            'parmanent_address' => ['json'],
            'local_guardian_name' => ['string', 'max:100'],
            'local_guardian_phone' => ['string', 'max:100'],
            'relation' => ['string', 'max:100'],
            'address' => ['json'],
        ];
    }
}
