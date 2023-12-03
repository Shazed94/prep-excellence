<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ApplicantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'job_id' => $this->job_id,
            'name' => $this->name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'image' => $this->image,
            'referral' => $this->referral,
            'school_college' => $this->school_college,
            'grade_year' => $this->grade_year,
            'subjects' => $this->subjects,
            'school_math_subject' => $this->school_math_subject,
            'top_subjects' => $this->top_subjects,
            'taught_class_before' => $this->taught_class_before,
            'taught_details' => $this->taught_details,
            'tutored_before' => $this->tutored_before,
            'how_long' => $this->how_long,
            'tutored_subject' => $this->tutored_subject,
            'sat_score_english' => $this->sat_score_english,
            'sat_score_math' => $this->sat_score_math,
            'sat_score_total' => $this->sat_score_total,
            'p_sat_score' => $this->p_sat_score,
            'act_english_score' => $this->act_english_score,
            'act_math_score' => $this->act_math_score,
            'act_science_score' => $this->act_science_score,
            'act_reading_score' => $this->act_reading_score,
            'act_total_score' => $this->act_total_score,
            'ap_exam_scores' => $this->ap_exam_scores,
            'hsc_gpa' => $this->hsc_gpa,
            'college_gpa' => $this->college_gpa,
            'available' => $this->available,
            'available_hour' => $this->available_hour,
            'preference_schedule' => $this->preference_schedule,
            'hourly_rate' => $this->hourly_rate,
            'willing_create_lesson' => $this->willing_create_lesson,
            'willing_topics' => $this->willing_topics,
            'lesson_rate' => $this->lesson_rate,
            'artical_write' => $this->artical_write,
            'artical_rate' => $this->artical_rate,
            'short_description' => $this->short_description,
            'is_agree' => $this->is_agree,
            'cv_file' => $this->cv_file,
            'publish_permission' => $this->publish_permission,
            'status' => $this->status,
            'job' => new JobResource($this->whenLoaded('job')),
        ];
    }
}
