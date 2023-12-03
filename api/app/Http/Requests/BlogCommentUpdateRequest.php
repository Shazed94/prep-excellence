<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BlogCommentUpdateRequest extends FormRequest
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
            'blog_id' => ['required','integer', 'exists:blogs,id'],
            'blog_comment_id' => ['nullable','integer', 'exists:blog_comments,id'],
            'name' => ['required','string', 'max:191'],
            'email' => ['required','email', 'max:191'],
            'phone_number' => ['nullable','string', 'max:100'],
            'comment' => ['required'],
        ];
    }
}
