<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class WorkExperienceResource extends JsonResource
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
            'institute' => $this->institute,
            'designation' => $this->designation,
            'number_of_year' => $this->number_of_year,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'is_working' => $this->is_working,
            'is_active' => $this->is_active,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'ip' => $this->ip,
            'browser' => $this->browser,
            'softdeletes' => $this->softdeletes,
        ];
    }
}
