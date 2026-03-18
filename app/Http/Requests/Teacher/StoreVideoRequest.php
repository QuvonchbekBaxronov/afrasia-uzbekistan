<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class StoreVideoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->role === 'teacher';
    }

    public function rules(): array
    {
        // PHP upload_max_filesize limitini KB da olamiz (Laravel max: KB ishlatadi)
        $maxKb = $this->parsePhpSize(ini_get('upload_max_filesize'));

        return [
            'title'            => 'required|string|max:255',
            'description'      => 'nullable|string',
            'duration_minutes' => 'required|integer|min:1',
            'video'            => 'required|file'
        ];
    }
}
