<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNotificationsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'email_notifications' => 'boolean',
            'push_notifications' => 'boolean',
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'email_notifications' => $this->has('email_notifications'),
            'push_notifications' => $this->has('push_notifications'),
        ]);
    }
}
