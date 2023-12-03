<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EmployeePaymentResource extends JsonResource
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
            'invoice_no' => $this->invoice_no,
            'employee_id' => $this->employee_id,
            'date' => $this->date,
            'regular_hour' => $this->regular_hour,
            'ot_hour' => $this->ot_hour,
            'total_hour' => $this->total_hour,
            'regular_amount' => $this->regular_amount,
            'ot_amount' => $this->ot_amount,
            'total_amount' => $this->total_amount,
            'regular_hour_rate' => $this->regular_hour_rate,
            'ot_hour_rate' => $this->ot_hour_rate,
            'payment_type' => $this->payment_type,
            'note' => $this->note,
            'is_paid' => $this->is_paid,
            'employee' => new EmployeeResource($this->whenLoaded('employee')),
            'employeeOverTimes' => EmployeeOverTimeCollection::make($this->whenLoaded('employeeOverTimes')),
        ];
    }
}
