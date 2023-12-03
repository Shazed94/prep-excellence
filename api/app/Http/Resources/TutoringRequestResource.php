<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TutoringRequestResource extends JsonResource
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
            'parent_name' => $this->parent_name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'student_name' => $this->student_name,
            'student_school' => $this->student_school,
            'student_grade' => $this->student_grade,
            'student_phone' => $this->student_phone,
            'student_email' => $this->student_email,
            'course' => $this->course,
            'other' => $this->other,
            'student_need' => $this->student_need,
            'day_time' => $this->day_time,
            'day_time_tutoring' => $this->day_time_tutoring,
            'referral' => $this->referral,
            'question' => $this->question,
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}
