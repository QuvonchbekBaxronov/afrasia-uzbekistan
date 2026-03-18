<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WatchCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'course_id' => 'required|exists:courses,id',
        ];
    }
}
