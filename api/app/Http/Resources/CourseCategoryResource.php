<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseCategoryResource extends JsonResource
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
            'name' => $this->name,
            'image' => $this->image,
            'position' => $this->position,
            'is_active' => $this->is_active,
            'courseSchedules' => CourseScheduleCollection::make($this->whenLoaded('courseSchedules')),
        ];
    }
}
