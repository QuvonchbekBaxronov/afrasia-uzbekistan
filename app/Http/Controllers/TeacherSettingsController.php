<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Services\ImageService;
use App\Http\Requests\Teacher\UpdateTeacherProfileRequest;
use App\Http\Requests\Auth\ChangePasswordRequest;

class TeacherSettingsController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function edit()
    {
        $user = Auth::user();
        return view('teacher.sections.settings', compact('user'));
    }

    public function updateProfile(UpdateTeacherProfileRequest $request)
    {
        $user = Auth::user();

        $validated = $request->validated();

        if ($request->hasFile('avatar')) {
            try {
                $user->avatar = $this->imageService->uploadImage(
                    $request->file('avatar'),
                    'avatars',
                    $user->avatar
                );
            } catch (\Throwable $e) {
                return back()->with('error', 'Avatar yuklashda xatolik: ' . $e->getMessage());
            }
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'] ?? $user->phone;
        $user->save();

        return back()->with('success', 'O\'qituvchi profili saqlandi');
    }

    public function updatePassword(ChangePasswordRequest $request)
    {
        $validated = $request->validated();

        Auth::user()->update(['password' => bcrypt($validated['password'])]);

        return back()->with('success', 'Parol muvaffaqiyatli yangilandi!');
    }
}
