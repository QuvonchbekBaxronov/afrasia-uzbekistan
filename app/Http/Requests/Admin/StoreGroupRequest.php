<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->is_admin;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|unique:groups,code',
            'teacher_id' => 'required|exists:users,id',
            'subject' => 'nullable|string',
            'level' => 'required|in:beginner,intermediate,advanced',
            'lesson_days' => 'nullable|string',
            'lesson_time' => 'nullable|date_format:H:i',
            'max_students' => 'required|integer|min:1',
            'monthly_fee' => 'required|numeric|min:0',
            'duration_months' => 'required|integer|min:1',
            'start_date' => 'nullable|date',
            'room' => 'nullable|string',
            'description' => 'nullable|string',
        ];
    }
}
