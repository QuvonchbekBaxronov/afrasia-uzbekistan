<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class SubmitQuizRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->role === 'user';
    }

    public function rules(): array
    {
        return [
            'answers' => 'required|array',
            'answers.*' => 'required|in:a,b,c,d',
        ];
    }
}
