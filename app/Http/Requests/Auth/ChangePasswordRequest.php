<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class ChangePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'min:8', 'confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'current_password.current_password' => 'Joriy parol noto\'g\'ri.',
            'password.min' => 'Yangi parol kamida 8 ta belgidan iborat bo\'lishi kerak.',
            'password.confirmed' => 'Yangi parollar mos kelmadi.',
        ];
    }
}
