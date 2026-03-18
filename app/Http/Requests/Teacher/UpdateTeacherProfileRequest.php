<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTeacherProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->role === 'teacher';
    }

    public function rules(): array
    {
        $user  = $this->user();
        $maxKb = $this->parsePhpSize(ini_get('upload_max_filesize'));

        return [
            'name'   => 'required|string|max:255',
            'email'  => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone'  => 'nullable|string|max:50',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:' . $maxKb,
        ];
    }

    public function messages(): array
    {
        $maxMb = round($this->parsePhpSize(ini_get('upload_max_filesize')) / 1024);
        return [
            'avatar.max'   => "Rasm hajmi {$maxMb}MB dan oshmasligi kerak.",
            'avatar.mimes' => 'Faqat JPEG, PNG, GIF yoki WEBP formatdagi rasmlar qabul qilinadi.',
        ];
    }

    private function parsePhpSize(string $size): int
    {
        $unit  = strtoupper(substr($size, -1));
        $value = (int) substr($size, 0, -1);
        return match ($unit) {
            'G' => $value * 1024 * 1024,
            'M' => $value * 1024,
            'K' => $value,
            default => (int) ceil((int) $size / 1024),
        };
    }
}
