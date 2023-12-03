<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobStoreRequest extends FormRequest
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
            'title' => ['required','string', 'max:191'],
            'image' => ['nullable','mimes:jpg,png'],
            'vacancy' => ['required','integer'],
            'job_context' => ['required','string'],
            'job_responsibilities' => ['required','string'],
            'employment_status' => ['required','string'],
            'educational_requirements' => ['required','string'],
            'experience_requirements' => ['required','string'],
            'additional_requirements' => ['nullable','string'],
            'job_location' => ['nullable','string'],
            'salary' => ['required','string', 'max:191'],
            'compensation_benefits' => ['required','string'],
            'gender' => ['required','string', 'max:191'],
            'last_date' => ['required','date'],
        ];
    }
}
