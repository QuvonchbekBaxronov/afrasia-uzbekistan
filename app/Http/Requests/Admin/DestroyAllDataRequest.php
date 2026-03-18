<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class DestroyAllDataRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->is_admin;
    }

    public function rules(): array
    {
        return [
            'confirmation' => 'required|string|in:DELETE ALL',
            'current_password' => 'required|current_password',
        ];
    }

    public function messages(): array
    {
        return [
            'confirmation.in' => 'Iltimos, tasdiqlash uchun "DELETE ALL" so\'zini kiriting.',
            'current_password.current_password' => 'Joriy parol noto\'g\'ri.',
        ];
    }
}
