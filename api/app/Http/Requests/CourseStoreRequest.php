<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CourseStoreRequest extends FormRequest
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
            'course_type_id' => ['nullable','integer', 'exists:course_types,id'],
            'course_type' => ['nullable','integer'],
            'category_ids' => ['required','not_in:0', 'exists:course_categories,id'],
            'employee_ids' => ['required','not_in:0', 'exists:employees,id'],
            'name' => ['required','string', 'max:191'],
            'image' => ['required','image', 'mimes:jpg,png,jpeg'],
            'level' => ['nullable','max:191'],
            'batch' => ['max:100'],
            'amount' => ['required', 'numeric','not_in:-1','min:1'],
            'start_date' => ['date'],
            'end_date' => ['date'],
            'duration_in_hour' => ['required', 'numeric','not_in:-1','min:1'],
            'duration_in_week' => ['required', 'integer','not_in:-1','min:1'],
            'course_location' => ['string', 'max:191'],
            'class_time' => ['max:191'],
            'course_outline' => [],
            'course_schedules'=>['required']
        ];
    }
}
