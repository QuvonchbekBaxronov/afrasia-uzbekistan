<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->is_admin;
    }

    public function rules(): array
    {
        $userId = $this->route('id'); // Assuming the route parameter is named 'id'
        
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $userId,
            'phone' => 'nullable|string|max:50',
            'role' => 'sometimes|string|in:user,teacher,admin',
        ];
    }
}
