<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChatStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            //'sender_id' => ['nullable','integer', 'exists:users,id'],
            'receiver_id' => ['nullable','integer', 'exists:users,id'],
            'chat_group_id' => ['nullable','integer', 'exists:chat_groups,id'],
            'message' => ['required','string'],
        ];
    }
}
