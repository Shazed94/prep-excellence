<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TutoringResource extends JsonResource
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
            'user_id' => $this->user_id,
            'courses' => $this->courses,
            'other' => $this->other,
            'student_need' => $this->student_need,
            'day_time' => $this->day_time,
            'day_time_tutoring' => $this->day_time_tutoring,
            'referral' => $this->referral,
            'question' => $this->question,
            'status' => $this->status,
            'hour_rate'=> $this->hour_rate,
            'total_hour'=> $this->total_hour,
            'amount'=> $this->amount,
            'tax'=> $this->tax,
            'discount'=> $this->discount,
            'total_amount'=> $this->total_amount,
            'refund_amount'=> $this->refund_amount,
            'tnx_no'=> $this->tnx_no,
            'is_paid'=> $this->is_paid,
            'created_at' => $this->created_at,
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }
}
