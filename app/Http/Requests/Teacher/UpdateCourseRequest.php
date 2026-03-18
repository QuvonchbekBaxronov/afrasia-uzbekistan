<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->role === 'teacher';
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration_hours' => 'nullable|numeric',
            'is_active' => 'sometimes|boolean',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp',
        ];
    }
}
