<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SubExpenseTypeResource extends JsonResource
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
            'name' => $this->name,
            'expense_type_id' => $this->expense_type_id,
            'expenseType' => new ExpenseTypeResource($this->whenLoaded('expenseType')),
            'is_active' => $this->is_active,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'ip' => $this->ip,
            'browser' => $this->browser,
            'softdeletes' => $this->softdeletes,
        ];
    }
}
