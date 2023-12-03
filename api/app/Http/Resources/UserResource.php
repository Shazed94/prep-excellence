<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'role_id' => $this->role_id,
            'userable_type' => $this->userable_type,
            'userable_id' => $this->userable_id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'name' => $this->name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'image' => $this->image,
            'gender_id' => $this->gender_id,
            'blood_group_id' => $this->blood_group_id,
            'religion_id' => $this->religion_id,
            'is_active' => $this->is_active,
            'menuPermissions' => PermissionResource::collection($this->whenLoaded('menuPermissions')),
            'receiveMessages' => ChatResource::collection($this->whenLoaded('receiveMessages')),
            'role' => new RoleResource($this->whenLoaded('role')),
            'gender' => new GenderResource($this->whenLoaded('gender')),
            'bloodGroup' => new BloodGroupResource($this->whenLoaded('bloodGroup')),
            'religion' => new ReligionResource($this->whenLoaded('religion')),
        ];
    }
}
