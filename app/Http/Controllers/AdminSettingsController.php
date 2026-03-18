<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Services\ImageService;

use App\Http\Requests\Admin\UpdateProfileRequest;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Admin\UpdateGeneralSettingsRequest;
use App\Http\Requests\Admin\DestroyAllDataRequest;
use Illuminate\Support\Facades\Storage;

class AdminSettingsController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function edit()
    {
        $user = Auth::user();
        $settings = Setting::all()->pluck('value', 'key')->toArray();
        return view('admin.sections.settings', compact('user', 'settings'));
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = Auth::user();
        $validated = $request->validated();

        $user->name  = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'] ?? $user->phone;

        if ($request->hasFile('avatar')) {
            try {
                if ($user->avatar) {
                    Storage::disk('minio')->delete($user->avatar);
                }

                $avatarPath = $this->imageService->uploadImage(
                    $request->file('avatar'),
                    'avatars'
                );

                $user->avatar = $avatarPath;

                Log::info('Avatar muvaffaqiyatli yuklandi', [
                    'user_id' => $user->id,
                    'path'    => $avatarPath,
                    'full_url' => Storage::disk('minio')->url($avatarPath)
                ]);
            } catch (\Exception $e) {
                Log::error('Avatar yuklash xatosi', ['error' => $e->getMessage()]);
                return back()->with('error', 'Rasm yuklashda xatolik: ' . $e->getMessage());
            }
        }

        if (!$user->isDirty()) {
            return back()->with('info', 'Hech qanday o\'zgarish kiritilmadi');
        }

        $user->save();

        return back()->with('success', 'Profil ma\'lumotlari yangilandi');
    }

    public function updatePassword(ChangePasswordRequest $request)
    {
        $validated = $request->validated();
        Auth::user()->update(['password' => bcrypt($validated['password'])]);
        return back()->with('success', 'Parol muvaffaqiyatli yangilandi');
    }

    public function updateGeneral(UpdateGeneralSettingsRequest $request)
    {
        $validated = $request->validated();

        $user = Auth::user();
        $user->update($validated);

        return back()->with('success', 'Umumiy sozlamalar saqlandi');
    }

    public function updateNotifications(Request $request)
    {
        $user = Auth::user();
        $user->update([
            'email_notifications' => $request->has('email_notifications'),
            'push_notifications' => $request->has('push_notifications'),
        ]);

        return back()->with('success', 'Bildirishnomalar yangilandi');
    }

    public function destroyAll(DestroyAllDataRequest $request)
    {
        $validated = $request->validated();

        $user = Auth::user();

        DB::beginTransaction();
        try {
            DB::statement('SET FOREIGN_KEY_CHECKS=0');

            $tables = [
                'group_messages',
                'groups',
                'courses',
                'payments',
                'contacts',
                'quizzes',
                'reflections',
                'modules',
                'videos',
                'posts'
            ];

            foreach ($tables as $t) {
                if (DB::getSchemaBuilder()->hasTable($t)) {
                    DB::table($t)->truncate();
                }
            }

            User::where('is_admin', false)->delete();

            DB::statement('SET FOREIGN_KEY_CHECKS=1');
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Ma\'lumotlarni o\'chirishda xatolik: ' . $e->getMessage());
        }

        return back()->with('success', 'Keraksiz ma\'lumotlar o\'chirildi');
    }
}
