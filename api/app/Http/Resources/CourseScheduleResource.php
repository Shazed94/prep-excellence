<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseScheduleResource extends JsonResource
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
            'course_id' => $this->course_id,
            'employee_id' => $this->employee_id,
            'date' => $this->date,
            'day' => $this->day,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'classes' => $this->classes,
            'is_exam' => $this->is_exam,
            'course_name' => $this->course_name,
            'class_link' => $this->class_link,
            'status' => $this->status,
            'is_active' => $this->is_active,
            'course'=>new CourseResource($this->whenLoaded('course')),
            'employee'=>new EmployeeResource($this->whenLoaded('employee')),
            ];
    }
}
