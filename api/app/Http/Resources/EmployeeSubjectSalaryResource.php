<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeSubjectSalaryResource extends JsonResource
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
            'course_type_id' => $this->course_type_id,
            'course_category_id' => $this->course_category_id,
            'hour_rate' => $this->hour_rate,
            'previous_hour_rate' => $this->previous_hour_rate,
            'is_active' => $this->is_active,
        ];
    }
}
