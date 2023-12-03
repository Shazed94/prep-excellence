<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
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
            'title' => $this->title,
            'image' => $this->image,
            'vacancy' => $this->vacancy,
            'job_context' => $this->job_context,
            'job_responsibilities' => $this->job_responsibilities,
            'employment_status' => $this->employment_status,
            'educational_requirements' => $this->educational_requirements,
            'experience_requirements' => $this->experience_requirements,
            'additional_requirements' => $this->additional_requirements,
            'job_location' => $this->job_location,
            'salary' => $this->salary,
            'compensation_benefits' => $this->compensation_benefits,
            'gender' => $this->gender,
            'last_date' => $this->last_date,
            'is_active' => $this->is_active,
        ];
    }
}
