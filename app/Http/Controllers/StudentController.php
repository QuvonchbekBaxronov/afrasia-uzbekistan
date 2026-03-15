<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Group;
use App\Models\GroupMessage;
use App\Models\Quiz;
use App\Models\Video;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function settings()
    {
        $user = Auth::user();
        return view('student.sections.settings', compact('user'));
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:50',
            'age' => 'nullable|integer|min:10|max:100',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Avatar yuklash S3 ga
        if ($request->hasFile('avatar')) {
            try {
                $file = $request->file('avatar');

                // S3 ga yuklash va public visibility
                $path = $file->store('avatars', [
                    'disk' => 's3',
                    'visibility' => 'public',
                ]);

                // Eski avatarni o'chirish
                if ($user->avatar && Storage::disk('s3')->exists($user->avatar)) {
                    Storage::disk('s3')->delete($user->avatar);
                }

                $user->avatar = $path;
            } catch (\Throwable $e) {
                return back()->with('error', 'Avatarni yuklashda xatolik: ' . $e->getMessage());
            }
        }

        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->phone = $data['phone'] ?? $user->phone;
        $user->save();

        return back()->with('success', 'Profil muvaffaqiyatli yangilandi!');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = Auth::user();

        // Joriy parolni tekshirish
        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Joriy parol noto\'g\'ri']);
        }

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return back()->with('success', 'Parol muvaffaqiyatli yangilandi!');
    }

    public function updateNotifications(Request $request)
    {
        $user = Auth::user();

        $user->update([
            'email_notifications' => $request->has('email_notifications'),
            'push_notifications' => $request->has('push_notifications'),
        ]);

        return back()->with('success', 'Bildirishnoma sozlamalari saqlandi!');
    }

    public function courses()
    {
        $enrolledCourses = Auth::user()
            ->enrolledCourses()
            ->with(['user', 'videos'])
            ->withCount('videos')
            ->latest()
            ->get();

        foreach ($enrolledCourses as $course) {
            $course->progress = rand(10, 90);

            foreach ($course->videos as $video) {
                if (config('filesystems.default') === 's3') {
                    $video->signed_url = Storage::disk('s3')->temporaryUrl(
                        $video->video_url,
                        Carbon::now()->addHours(5),
                        ['ResponseContentType' => 'video/mp4']
                    );
                } else {
                    $video->signed_url = asset('storage/' . $video->video_url);
                }
            }
        }

        return view('student.sections.courses', compact('enrolledCourses'));
    }

    public function courseDetail($courseId)
    {
        $course = Course::with([
            'user',
            'videos' => fn($q) => $q->orderBy('id'),
            'quizzes',
        ])
            ->withCount(['videos', 'quizzes'])
            ->findOrFail($courseId);

        if (!Auth::user()->enrolledCourses()->where('course_id', $courseId)->exists()) {
            abort(403, 'Siz bu kursga ro\'yxatdan o\'tmagansiz.');
        }

        foreach ($course->videos as $video) {
            if (config('filesystems.default') === 's3') {
                $video->signed_url = Storage::disk('s3')->temporaryUrl(
                    $video->video_url,
                    Carbon::now()->addHours(5),
                    ['ResponseContentType' => 'video/mp4']
                );
            } else {
                $video->signed_url = asset('storage/' . $video->video_url);
            }
        }

        return view('student.sections.course-detail', compact('course'));
    }

    public function takeQuiz($quizId)
    {
        $quiz = Quiz::with('questions', 'course')->findOrFail($quizId);

        if (!$quiz->course || $quiz->course->course_type !== 'theory' || !Auth::user()->enrolledCourses()->where('course_id', $quiz->course_id)->exists()) {
            abort(403, 'Ruxsat etilmagan.');
        }

        return view('student.quiz.take', compact('quiz'));
    }

    public function submitQuiz(Request $request, $quizId)
    {
        $quiz = Quiz::with('questions')->findOrFail($quizId);

        if ($quiz->course->course_type !== 'theory' || !Auth::user()->enrolledCourses()->where('course_id', $quiz->course_id)->exists()) {
            abort(403, 'Ruxsat etilmagan.');
        }

        $request->validate([
            'answers' => 'required|array',
            'answers.*' => 'required|in:a,b,c,d',
        ]);

        $score = 0;
        $totalPoints = $quiz->questions->sum('points');

        foreach ($quiz->questions as $question) {
            $userAnswer = $request->answers[$question->id] ?? null;
            if ($userAnswer && strtolower($userAnswer) === strtolower($question->correct_answer)) {
                $score += $question->points;
            }
        }

        $percentage = ($totalPoints > 0) ? ($score / $totalPoints) * 100 : 0;
        $passed = $percentage >= $quiz->passing_score_percentage;

        return view('student.quiz.result', compact('quiz', 'score', 'totalPoints', 'percentage', 'passed'));
    }

    public function lesson($lessonId)
    {
        $video = Video::with('course.user')->findOrFail($lessonId);

        if (!Auth::user()->enrolledCourses()->where('course_id', $video->course_id)->exists()) {
            abort(403, 'Ruxsat etilmagan.');
        }

        return view('student.lesson', compact('video'));
    }

    public function dashboard()
    {
        return view('student.sections.dashboard');
    }

    public function chats()
    {
        $user = Auth::user();

        $courseIds = DB::table('course_student')
            ->where('user_id', $user->id)   // yoki sizning ustuningiz nomi
            ->pluck('course_id');

        $teacherIds = DB::table('courses')
            ->whereIn('id', $courseIds)
            ->pluck('user_id')
            ->unique();

        $groups = Group::query()
            ->whereIn('teacher_id', $teacherIds)
            ->with('teacher')
            ->withCount('messages as messages_count')
            ->with(['messages' => fn($q) => $q->latest()->limit(1)])
            ->latest('updated_at')
            ->get();

        $selectedGroup = $groups->first();

        $messages = collect();
        if ($selectedGroup) {
            $messages = GroupMessage::with('user')
                ->where('group_id', $selectedGroup->id)
                ->latest()
                ->limit(100)
                ->get()
                ->reverse();
        }

        return view('student.sections.chats', compact('groups', 'selectedGroup', 'messages'));
    }

    public function loadGroupChat($id)
    {
        try {
            $selectedGroup = Group::with('teacher')->findOrFail($id);

            $messages = GroupMessage::with('user')
                ->where('group_id', $id)
                ->latest()
                ->limit(100)
                ->get()
                ->reverse();

            $html = view('student.sections.chat-window', compact('selectedGroup', 'messages'))->render();

            if (request()->ajax() || request()->wantsJson()) {
                return response()->json([
                    'html'                  => $html,
                    'group_id'              => $selectedGroup->id,
                    'last_message'          => optional($messages->last())->message ?? null,
                    'last_time'             => optional($messages->last())->created_at?->diffForHumans() ?? null,
                    'messages_count'        => GroupMessage::where('group_id', $id)->count(),
                    'last_message_id'       => optional($messages->last())->id ?? 0,
                ]);
            }

            return view('student.sections.chat-window', compact('selectedGroup', 'messages'));
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Guruh topilmadi.'
            ], 404);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Serverda texnik xatolik. Iltimos keyinroq urinib ko‘ring.'
            ], 500);
        }
    }

    public function pollGroupMessages($id, Request $request)
    {
        try {
            $user = Auth::user();

            // TO'G'IRLANDI: student_id ishlatildi
            $exists = Group::whereHas('students', fn($q) => $q->where('student_id', $user->id))
                ->where('id', $id)
                ->exists();

            if (!$exists) {
                abort(403);
            }

            $lastId = (int) $request->query('last_id', 0);

            $messages = GroupMessage::with('user')
                ->where('group_id', $id)
                ->when($lastId > 0, function ($q) use ($lastId) {
                    $q->where('id', '>', $lastId);
                })
                ->orderBy('id')
                ->get();

            $html = '';
            foreach ($messages as $msg) {
                $html .= view('student.sections.partials.message', compact('msg'))->render();
            }

            $newLastId = $messages->last()?->id ?? $lastId;

            return response()->json([
                'html' => $html,
                'last_message_id' => $newLastId,
                'messages_count' => GroupMessage::where('group_id', $id)->count(),
                'last_message' => optional($messages->last())->message ?? null,
                'last_time' => optional($messages->last())->created_at?->diffForHumans() ?? null,
                'last_user_id' => optional($messages->last())->user_id ?? null,
            ]);
        } catch (\Throwable $e) {
            Log::error('Student pollGroupMessages error', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Polling xatosi'], 500);
        }
    }

    public function sendChatMessage(Request $request)
    {
        try {
            $request->validate([
                'group_id' => 'required|exists:groups,id',  // faqat guruh mavjudligini tekshiradi
                'message'  => 'required|string|max:1000'
            ]);

            $user = Auth::user();

            // Tekshiruv olib tashlandi — endi faqat group mavjud bo'lsa yetarli
            $group = Group::findOrFail($request->group_id);

            $message = GroupMessage::create([
                'group_id' => $group->id,
                'user_id'  => $user->id,
                'message'  => $request->message,
            ]);

            // Load the user relationship for broadcasting and view
            $message->load('user');

            // Real-time event
            event(new \App\Events\NewGroupMessage($message));

            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success'       => true,
                    'group_id'      => $group->id,
                    'last_message'  => $message->message,
                    'last_time'     => $message->created_at->diffForHumans(),
                    'messages_count' => GroupMessage::where('group_id', $group->id)->count(),
                    'last_message_id' => $message->id,
                    'message_html'  => view('student.sections.partials.message', ['msg' => $message])->render(),
                    'message_id'    => $message->id,
                ]);
            }

            return back()->with('success', 'Xabar yuborildi');
        } catch (\Illuminate\Validation\ValidationException $e) {
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Xato: ' . implode(', ', array_map(fn($arr) => implode(', ', $arr), $e->errors()))
                ], 422);
            }
            throw $e;
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Guruh topilmadi.'
                ], 404);
            }
            abort(404, 'Guruh topilmadi');
        } catch (\Throwable $e) {
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Xabar yuborishda xatolik yuz berdi. Iltimos keyinroq urinib ko‘ring.'
                ], 500);
            }
            throw $e;
        }
    }
}
