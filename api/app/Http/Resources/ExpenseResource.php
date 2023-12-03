<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
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
            'expense_type_id' => $this->expense_type_id,
            'expenseType' => new ExpenseTypeResource($this->whenLoaded('expenseType')),
            'sub_expense_type_id' => $this->sub_expense_type_id,
            'subExpenseType' => new SubExpenseTypeResource($this->whenLoaded('subExpenseType')),
            'expense_date' => $this->expense_date,
            'amount' => $this->amount,
            'payment_type_id' => $this->payment_type_id,
            'payment_type' => new PaymentTypeResource($this->whenLoaded('paymentType')),
            'bank_account_id' => $this->bank_account_id,
            'bankAccount' => new BankAccountResource($this->whenLoaded('bankAccount')),
            'check_no' => $this->check_no,
            'check_date' => $this->check_date,
            'note' => $this->note,
            'is_active' => $this->is_active,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'ip' => $this->ip,
            'browser' => $this->browser
        ];
    }
}
