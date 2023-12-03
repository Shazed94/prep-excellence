<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmailStoreRequest extends FormRequest
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
            'role_ids' => ['not_in:0', 'exists:roles,id'],
            'subject' => ['string', 'max:191'],
            'message' => ['required'],
            'file' => ['nullable','mimes:jpg,png,jepg,webp,mp4','max:5120'],
            'notifications' => ['required','min:1','max:3'],
        ];
    }
}
