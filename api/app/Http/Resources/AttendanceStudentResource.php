<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceStudentResource extends JsonResource
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
            'employee_id' => $this->employee_id,
            'course_id' => $this->course_id,
            'attendance_status_id' => $this->attendance_status_id,
            'course_schedule_id' => $this->course_schedule_id,
            'date' => $this->date,
            'attendanceStatus' => new AttendanceStatusResource($this->whenLoaded('attendanceStatus')),
            ];
    }
}
