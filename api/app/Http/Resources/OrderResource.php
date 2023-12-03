<?php

namespace App\Http\Resources;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'status' => $this->status,
            'admin_read' => $this->admin_read,
            'payment_status' => $this->payment_status,
            'user_id' => $this->user_id,
            'product_total' => $this->product_total,
            'tax' => $this->tax,
            'tax_amount' => $this->tax_amount,
            'other_cost' => $this->other_cost,
            'discount' => $this->discount,
            'discount_amount' => $this->discount_amount,
            'total' => $this->total,
            'payment_method' => $this->payment_method,
            'payment_transaction_id' => $this->payment_transaction_id,
            'refund_other_charge' => $this->refund_other_charge,
            'refund_product_total' => $this->refund_product_total,
            'refund_tax_amount' => $this->refund_tax_amount,
            'refund_total_amount' => $this->refund_total_amount,
            'coupon_id' => $this->coupon_id,
            'coupon_code' => $this->coupon_code,
            'note' => $this->note,
            'staff_note' => $this->staff_note,
            'reference_no' => $this->reference_no,
            'attachment' => $this->attachment,
            'created_at' => Carbon::parse($this->created_at)->format('m-d-Y'),
            'user' =>new UserResource($this->whenLoaded('user')),
            'orderPayment' =>new OrderPaymentResource($this->whenLoaded('orderPayment')),
            'studentCourses' => StudentCourseResource::collection($this->whenLoaded('studentCourses')),
            'courses' => CourseResource::collection($this->whenLoaded('courses')),
        ];
    }
}
