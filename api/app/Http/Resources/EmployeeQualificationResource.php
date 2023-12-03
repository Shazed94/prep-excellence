<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeQualificationResource extends JsonResource
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
            'exam_name' => $this->exam_name,
            'institute' => $this->institute,
            'state' => $this->state,
            'country' => $this->country,
            'result' => $this->result,
            'out_of_result' => $this->out_of_result,
            'is_active' => $this->is_active,
        ];
    }
}
