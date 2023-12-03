<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApplicantUpdateRequest extends FormRequest
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
            'job_id' => ['nullable','integer', 'exists:jobs,id'],
            'name' => ['required','string', 'max:191'],
            'email' => ['required','email', 'max:60'],
            'phone_number' => ['required','string', 'max:30'],
            'image' => ['nullable','mimes:png,jpg,jpeg'],
            'referral' => ['nullable','string', 'max:191'],
            'school_college' => ['nullable','string', 'max:191'],
            'grade_year' => ['nullable','string', 'max:191'],
            'subjects' => ['required','json'],
            'school_math_subject' => ['nullable','string', 'max:191'],
            'top_subjects' => ['required','json'],
            'taught_class_before' => ['nullable',],
            'taught_details' => ['nullable','string'],
            'tutored_before' => ['required'],
            'how_long' => ['nullable','string', 'max:191'],
            'tutored_subject' => ['nullable','string', 'max:191'],
            'sat_ score_english' => ['nullable','string', 'max:191'],
            'sat_ score_math' => ['nullable','string', 'max:191'],
            'sat_ score_total' => ['nullable','string', 'max:191'],
            'p_sat_score' => ['nullable','string', 'max:191'],
            'act_english_score' => ['nullable','string', 'max:191'],
            'act_math_score' => ['nullable','string', 'max:191'],
            'act_science_score' => ['nullable','string', 'max:191'],
            'act_reading_score' => ['nullable','string', 'max:191'],
            'act_total_score' => ['nullable','string', 'max:191'],
            'ap_exam_scores' => ['nullable','string'],
            'hsc_gpa' => ['nullable','string', 'max:191'],
            'college_gpa' => ['nullable','string', 'max:191'],
            'available' => ['nullable','string'],
            'available_hour' => ['nullable','string', 'max:191'],
            'preference_schedule' => ['nullable','string'],
            'hourly_rate' => ['nullable','numeric'],
            'willing_create_lesson' => ['nullable',],
            'willing_ topics' => ['nullable','string'],
            'lesson_rate' => ['nullable','string'],
            'artical_write' => ['nullable',],
            'artical_rate' => ['nullable','numeric'],
            'short_description' => ['nullable','string'],
            'is_agree' => ['nullable',],
            'cv_file' => ['nullable','mimes:pdf'],
            'publish_permission' => ['nullable'],
            'status' => ['integer'],
        ];
    }
}
