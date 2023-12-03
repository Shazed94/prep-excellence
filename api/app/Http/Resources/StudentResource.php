<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
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
            'roll_no' => $this->roll_no,
            'parent_id' => $this->parent_id,
            'date_of_birth' => $this->date_of_birth,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'userable' =>new UserResource($this->whenLoaded('userable')),
            'parents' =>new ParentResource($this->whenLoaded('parents')),
        ];
    }
}
