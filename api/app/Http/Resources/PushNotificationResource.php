<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PushNotificationResource extends JsonResource
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
            'subject' => $this->subject,
            'user_id' => $this->user_id,
            'role_id' => $this->role_id,
            'message' => $this->message,
            'link' => $this->link,
            'is_seen' => $this->is_seen,
            'created_at' => $this->created_at,
            'user'=> new UserResource($this->whenLoaded('user')),
            'role'=> new RoleResource($this->whenLoaded('role')),
        ];
    }
}
