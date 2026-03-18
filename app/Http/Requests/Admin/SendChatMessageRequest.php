<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SendChatMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && (auth()->user()->is_admin || auth()->user()->is_teacher);
    }

    public function rules(): array
    {
        return [
            'group_id' => 'required|exists:groups,id',
            'message'  => 'required|string|max:1000'
        ];
    }
}
