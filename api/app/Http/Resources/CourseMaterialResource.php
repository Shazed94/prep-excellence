<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseMaterialResource extends JsonResource
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
            'expire_date' => $this->expire_date,
            'type' => $this->type,
            'file' => $this->file,
            'video' => $this->video,
            'employee_id' => $this->employee_id,
            'position' => $this->position,
            'is_active' => $this->is_active,
            'updated_at' => $this->updated_at,
            'course'=> new CourseResource($this->whenLoaded('course'))
        ];
    }
}
