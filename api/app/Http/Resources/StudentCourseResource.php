<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentCourseResource extends JsonResource
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
            'student_id' => $this->student_id,
            'course_id' => $this->course_id,
            'amount' => $this->amount,
            'payment_status' => $this->payment_status,
            'payment_type' => $this->payment_type,
            'transaction_no' => $this->transaction_no,
            'payment_details' => $this->payment_details,
            'is_approved' => $this->is_approved,
            'is_active' => $this->is_active,
            'student'=>new StudentResource($this->whenLoaded('student')),
            'course'=>new CourseResource($this->whenLoaded('course')),
        ];
    }
}
