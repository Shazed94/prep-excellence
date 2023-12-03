<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ChatResource extends JsonResource
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
            'sender_id' => $this->sender_id,
            'receiver_id' => $this->receiver_id,
            'chat_group_id' => $this->chat_group_id,
            'message' => $this->message,
            'is_seen' => $this->is_seen,
            'created_at' => $this->created_at,
            'chatFiles' => ChatFileCollection::make($this->whenLoaded('chatFiles')),
        ];
    }
}
