<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ContactUsResource extends JsonResource
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
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'name' => $this->name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'subject' => $this->subject,
            'state_or_region' => $this->state_or_region,
            'country' => $this->country,
            'student_grade' => $this->student_grade,
            'course' => $this->course,
            'other' => $this->other,
            'day_time' => $this->day_time,
            'message' => $this->message,
        ];
    }
}
