<?php

namespace App\Http\Resources;

use App\Models\HomeWork;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentHomeWorkResource extends JsonResource
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
            'home_work_id' => $this->home_work_id,
            'student_id' => $this->student_id,
            'file' => $this->file,
            'submission_type' => $this->submission_type,
            'mark' => $this->mark,
            'total_mark' => $this->total_mark,
            'is_active' => $this->is_active,
            'student'=> new StudentResource($this->whenLoaded('student')),
            'homeWork'=> new HomeWorkResource($this->whenLoaded('homeWork')),
        ];
    }
}
