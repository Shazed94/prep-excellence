<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ParentResource extends JsonResource
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
            'father_name' => $this->father_name,
            'father_profession' => $this->father_profession,
            'father_phone_no' => $this->father_phone_no,
            'father_nid' => $this->father_nid,
            'mother_name' => $this->mother_name,
            'mother_profession' => $this->mother_profession,
            'mother_phone_number' => $this->mother_phone_number,
            'mother_nid' => $this->mother_nid,
            'present_address' => $this->present_address,
            'parmanent_address' => $this->parmanent_address,
            'local_guardian_name' => $this->local_guardian_name,
            'local_guardian_phone' => $this->local_guardian_phone,
            'relation' => $this->relation,
            'address' => $this->address,
            'is_active' => $this->is_active,
            'userable' =>new UserResource($this->whenLoaded('userable')),
        ];
    }
}
