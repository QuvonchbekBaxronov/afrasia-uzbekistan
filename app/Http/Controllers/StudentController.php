<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Group;
use App\Models\GroupMessage;
use App\Models\Quiz;
use App\Models\Video;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Services\ImageService;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Student\UpdateStudentProfileRequest;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Student\SubmitQuizRequest;
use App\Http\Requests\Student\UpdateNotificationsRequest;
use App\Http\Requests\Admin\SendChatMessageRequest;

class StudentController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }
    public function settings()
    {
        $user = Auth::user();
        return view('student.sections.settings', compact('user'));
    }

    public function updateProfile(UpdateStudentProfileRequest $request)
    {
        $user = Auth::user();
        $validated = $request->validated();

        // Avatar yuklash
        if ($request->hasFile('avatar')) {
            try {
                $user->avatar = $this->imageService->uploadImage(
                    $request->file('avatar'),
                    'avatars',
                    $user->avatar
                );
            } catch (\Throwable $e) {
                return back()->with('error', 'Avatarni yuklashda xatolik: ' . $e->getMessage());
            }
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'] ?? $user->phone;
        $user->save();

        return back()->with('success', 'Profil muvaffaqiyatli yangilandi!');
    }

    public function updatePassword(ChangePasswordRequest $request)
    {
        $validated = $request->validated();

        $user = Auth::user();

        $user->update([
            'password' => Hash::make($validated['password'])
        ]);

        return back()->with('success', 'Parol muvaffaqiyatli yangilandi!');
    }

    public function updateNotifications(UpdateNotificationsRequest $request)
    {
        $user = Auth::user();
        $validated = $request->validated();

        $user->update([
            'email_notifications' => $validated['email_notifications'],
            'push_notifications' => $validated['push_notifications'],
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
                $video->signed_url = $video->resolved_url;
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
            $video->signed_url = $video->resolved_url;
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

    public function submitQuiz(SubmitQuizRequest $request, $quizId)
    {
        $quiz = Quiz::with('questions')->findOrFail($quizId);

        if ($quiz->course->course_type !== 'theory' || !Auth::user()->enrolledCourses()->where('course_id', $quiz->course_id)->exists()) {
            abort(403, 'Ruxsat etilmagan.');
        }

        $validated = $request->validated();

        $score = 0;
        $totalPoints = $quiz->questions->sum('points');

        foreach ($quiz->questions as $question) {
            $userAnswer = $validated['answers'][$question->id] ?? null;
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

    public function sendChatMessage(SendChatMessageRequest $request)
    {
        try {
            $validated = $request->validated();

            $user = Auth::user();

            // Tekshiruv olib tashlandi — endi faqat group mavjud bo'lsa yetarli
            $group = Group::findOrFail($request->group_id);

            $message = GroupMessage::create([
                'group_id' => $validated['group_id'],
                'user_id'  => $user->id,
                'message'  => $validated['message'],
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
