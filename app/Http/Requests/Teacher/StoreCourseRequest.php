<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
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
            'duration_hours' => 'nullable|numeric|min:0',
            'is_active' => 'sometimes|boolean',
            'course_type' => 'required|in:regular,theory',
            'img' => 'required|image|mimes:jpeg,png,jpg,gif,webp',
        ];
    }

    public function messages(): array
    {
        return [
            'img.image' => 'Yuklangan fayl rasm formatida bo‘lishi kerak.',
            'img.mimes' => 'Faqat jpg, jpeg, png, gif yoki webp formatidagi rasmlarga ruxsat beriladi.',
            'img.required' => "Rasm yuklash majburiy"
        ];
    }
}
