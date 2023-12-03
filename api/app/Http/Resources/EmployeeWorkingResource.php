<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeWorkingResource extends JsonResource
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
            'course_schedule_id' => $this->course_schedule_id,
            'employee_id' => $this->employee_id,
            'date' => $this->date,
            'working_hour' => $this->working_hour,
            'hour_rate' => $this->hour_rate,
            'is_paid' => $this->is_paid,
        ];
    }
}
