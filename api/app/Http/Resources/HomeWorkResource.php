<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class HomeWorkResource extends JsonResource
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
            'submission_last_date' => $this->submission_last_date,
            'submission_last_date_us' => $this->submission_last_date_us,
            'file' => $this->file,
            'employee_id' => $this->employee_id,
            'total_mark' => $this->total_mark,
            'is_active' => $this->is_active,
            'course'=> new CourseResource($this->whenLoaded('course')),
            'studentHomeWorks'=> StudentHomeWorkResource::collection($this->whenLoaded('studentHomeWorks')),
        ];
    }
}
