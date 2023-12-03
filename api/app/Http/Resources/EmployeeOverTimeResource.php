<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeOverTimeResource extends JsonResource
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
            'employee_id' => $this->employee_id,
            'course_id' => $this->course_id,
            'date' => $this->date,
            'date_us' => $this->date_us,
            'working_hour' => $this->working_hour,
            'hour_rate' => $this->hour_rate,
            'work_type' => $this->work_type,
            'note' => $this->note,
            'status' => $this->status,
            'is_paid' => $this->is_paid,
            'employee' => new EmployeeResource($this->whenLoaded('employee')),
            'course' => new CourseResource($this->whenLoaded('course')),
        ];
    }
}
