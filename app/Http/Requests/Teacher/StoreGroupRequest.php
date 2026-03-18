<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class StoreGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->role === 'teacher';
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'subject' => 'nullable|string|max:255',
            'lesson_time' => 'nullable|string|max:10',
            'lesson_days' => 'nullable|string|max:255',
            'max_students' => 'nullable|integer|min:1',
            'status' => 'nullable|in:active,inactive,full',
        ];
    }
}
