<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Group;
use App\Models\GroupMessage;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\Quizzes;
use App\Models\User;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use App\Services\VideoService;
use App\Services\ImageService;
use App\Http\Requests\Admin\SendChatMessageRequest;
use App\Http\Requests\Teacher\StoreCourseRequest;
use App\Http\Requests\Teacher\StoreQuizRequest;
use App\Http\Requests\Teacher\StoreGroupRequest;
use App\Http\Requests\Teacher\UpdateCourseRequest;
use App\Http\Requests\Teacher\StoreVideoRequest;

class TeacherController extends Controller
{
    protected $videoService;
    protected $imageService;

    public function __construct(VideoService $videoService, ImageService $imageService)
    {
        $this->videoService = $videoService;
        $this->imageService = $imageService;
    }

    public function dashboard()
    {
        $user = Auth::user();

        // Number of courses owned by this teacher
        $coursesCount = Course::where('user_id', $user->id)->count();

        // Active groups taught by this teacher
        $activeGroups = Group::where('teacher_id', $user->id)->where('status', 'active')->count();

        // Students: unique users from course_student and group_student
        $courseStudentIds = DB::table('course_student')
            ->whereIn('course_id', function ($q) use ($user) {
                $q->select('id')->from('courses')->where('user_id', $user->id);
            })->pluck('user_id')->toArray();

        // Note: group_student uses `student_id` column
        $groupStudentIds = DB::table('group_student')
            ->whereIn('group_id', function ($q) use ($user) {
                $q->select('id')->from('groups')->where('teacher_id', $user->id);
            })->pluck('student_id')->toArray();

        $studentIds = array_unique(array_merge($courseStudentIds, $groupStudentIds));
        $studentsCount = count($studentIds);

        // Average rating (if `rating` column exists on courses)
        $avgRating = null;
        if (Schema::hasColumn('courses', 'rating')) {
            $avgRating = Course::where('user_id', $user->id)->avg('rating');
            $avgRating = $avgRating ? round($avgRating, 1) : null;
        }

        // Recent activities: enrollments and group joins and messages
        $activities = [];

        // Recent course enrollments
        $courseEnrolls = DB::table('course_student')
            ->whereIn('course_id', function ($q) use ($user) {
                $q->select('id')->from('courses')->where('user_id', $user->id);
            })->orderBy('created_at', 'desc')->limit(10)->get();

        foreach ($courseEnrolls as $row) {
            $activities[] = [
                'type' => 'course_enroll',
                'user_id' => $row->user_id,
                'course_id' => $row->course_id,
                'created_at' => $row->created_at,
            ];
        }

        // Recent group joins
        $groupJoins = DB::table('group_student')
            ->whereIn('group_id', function ($q) use ($user) {
                $q->select('id')->from('groups')->where('teacher_id', $user->id);
            })->orderBy('created_at', 'desc')->limit(10)->get();

        foreach ($groupJoins as $row) {
            $activities[] = [
                'type' => 'group_join',
                // group_student stores the joining user's id in `student_id`
                'user_id' => $row->student_id ?? null,
                'group_id' => $row->group_id,
                'created_at' => $row->created_at ?? $row->enrolled_at ?? null,
            ];
        }

        // Recent group messages in teacher's groups
        $groupIds = Group::where('teacher_id', $user->id)->pluck('id')->toArray();
        $messages = GroupMessage::with('user')
            ->whereIn('group_id', $groupIds)
            ->latest()
            ->limit(10)
            ->get();

        foreach ($messages as $m) {
            $activities[] = [
                'type' => 'group_message',
                'user_id' => $m->user_id,
                'message' => $m->message,
                'created_at' => $m->created_at,
            ];
        }

        // Normalize activities: attach user and related entity info, sort and limit
        $activities = collect($activities)
            ->sortByDesc('created_at')
            ->take(6)
            ->values()
            ->toArray();

        // Load users for activities
        $userIds = array_values(array_unique(array_filter(array_map(function ($a) {
            return $a['user_id'] ?? null;
        }, $activities))));
        $users = User::whereIn('id', $userIds)->get()->keyBy('id');

        // Enhance activities
        foreach ($activities as &$a) {
            $a['user'] = $users[$a['user_id']] ?? null;
            if ($a['type'] === 'course_enroll' && isset($a['course_id'])) {
                $a['title'] = Course::find($a['course_id'])?->title ?? 'Kurs';
            }
            if ($a['type'] === 'group_join' && isset($a['group_id'])) {
                $a['title'] = Group::find($a['group_id'])?->name ?? 'Guruh';
            }
        }

        return view('teacher.sections.dashboard', compact(
            'coursesCount',
            'studentsCount',
            'activeGroups',
            'avgRating',
            'activities'
        ));
    }

    public function groups()
    {
        $user = Auth::user();
        $groups = Group::withCount('students')
            ->where('teacher_id', $user->id)
            ->latest()
            ->get();

        return view('teacher.sections.groups', compact('groups'));
    }

    public function storeGroup(StoreGroupRequest $request)
    {
        $user = Auth::user();
        $validated = $request->validated();
        $validated['teacher_id'] = $user->id;

        Group::create($validated);

        return back()->with('success', 'Guruh yaratildi');
    }

    /**
     * Return a group's data (JSON) for AJAX editing/viewing
     */
    public function showGroup($id)
    {
        $user = Auth::user();
        $group = Group::where('id', $id)->where('teacher_id', $user->id)->withCount('students')->firstOrFail();

        return response()->json([
            'group' => $group,
        ]);
    }

    /**
     * Update a group (teacher-owned)
     */
    public function updateGroup(StoreGroupRequest $request, $id)
    {
        $user = Auth::user();
        $group = Group::where('id', $id)->where('teacher_id', $user->id)->firstOrFail();

        $validated = $request->validated();

        $group->update($validated);

        if ($request->ajax() || $request->wantsJson()) {
            return response()->json(['message' => 'Guruh yangilandi', 'group' => $group]);
        }

        return back()->with('success', 'Guruh yangilandi');
    }

    /**
     * Delete a group owned by the teacher
     */
    public function destroyGroup($id)
    {
        $user = Auth::user();
        $group = Group::where('id', $id)->where('teacher_id', $user->id)->firstOrFail();

        $group->delete();

        if (request()->ajax() || request()->wantsJson()) {
            return response()->json(['message' => 'Guruh o‘chirildi']);
        }

        return back()->with('success', 'Guruh o‘chirildi');
    }

    public function courses()
    {
        $user = Auth::user();
        $courses = Course::where('user_id', $user->id)->withCount('students')->with('videos')->latest()->get();

        return view('teacher.sections.courses', compact('courses'));
    }

    public function storeCourse(StoreCourseRequest $request)
    {
        $user = Auth::user();
        $validated = $request->validated();

        if ($request->hasFile('img')) {
            try {
                $validated['img'] = $this->imageService->uploadImage(
                    $request->file('img'),
                    'courses'
                );
            } catch (\Exception $e) {
                return back()->with('error', 'Rasm yuklash muvaffaqiyatsiz tugadi.');
            }
        }

        $validated['description'] = $validated['description'] ?? '';
        $validated['duration_hours'] = $validated['duration_hours'] ?? 0;
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['user_id'] = $user->id;

        try {
            Course::create($validated);
            return back()->with('success', 'Kurs muvaffaqiyatli yaratildi!');
        } catch (\Exception $e) {
            Log::error('Kurs yaratish xatosi: ' . $e->getMessage());
            return back()->with('error', 'Kursni saqlashda kutilmagan xatolik yuz berdi: ' . $e->getMessage());
        }
    }

    /**
     * Show a course owned by the teacher (JSON for AJAX)
     */
    public function showCourse($id)
    {
        $user = Auth::user();
        $course = Course::where('id', $id)->where('user_id', $user->id)->with('videos')->first();
        if (!$course) {
            return response()->json(['message' => 'Kurs topilmadi.'], 404);
        }

        return response()->json(['course' => $course]);
    }

    /**
     * Update a course owned by the teacher
     */
    public function updateCourse(UpdateCourseRequest $request, $id)
    {
        $user = Auth::user();
        $course = Course::where('id', $id)->where('user_id', $user->id)->first();
        if (!$course) {
            return back()->with('error', 'Kurs topilmadi yoki ruxsat yo\'q.');
        }

        $validated = $request->validated();

        if ($request->hasFile('img')) {
            try {
                $validated['img'] = $this->imageService->uploadImage(
                    $request->file('img'),
                    'courses',
                    $course->img
                );
            } catch (\Exception $e) {
                return back()->with('error', 'Rasm yuklash muvaffaqiyatsiz tugadi.');
            }
        }

        try {
            $course->update($validated);

            if ($request->ajax() || $request->wantsJson()) {
                return response()->json(['message' => 'Kurs yangilandi', 'course' => $course]);
            }

            return back()->with('success', 'Kurs yangilandi');
        } catch (\Exception $e) {
            Log::error('Kurs yangilash xatosi: ' . $e->getMessage());
            return back()->with('error', 'Kursni yangilashda kutilmagan xatolik yuz berdi: ' . $e->getMessage());
        }
    }

    /**
     * Delete a course owned by the teacher
     */
    public function destroyCourse($id)
    {
        $user = Auth::user();
        $course = Course::where('id', $id)->where('user_id', $user->id)->first();
        if (!$course) {
            return back()->with('error', 'Kurs topilmadi yoki ruxsat yo\'q.');
        }
        $course->delete();

        if (request()->ajax() || request()->wantsJson()) {
            return response()->json(['message' => 'Kurs o‘chirildi']);
        }

        return back()->with('success', 'Kurs o‘chirildi');
    }

    /**
     * Upload a video to a course (teacher-owned)
     */
    public function storeVideo(Request $request, $courseId)
    {
        $course = Auth::user()->courses()->find($courseId);
        if (!$course) {
            return back()->with('error', 'Kurs topilmadi.');
        }

        if (!$request->hasFile('video')) {
            return back()->with('error', 'Video fayl tanlanmagan.');
        }

        try {
            $video = $this->videoService->uploadVideo(
                $request->file('video'),
                $request->all(),
                $course
            );

            return back()->with('success', 'Video muvaffaqiyatli yuklandi!');
        } catch (\Exception $e) {
            Log::error('Video yuklash xatosi: ' . $e->getMessage());
            return back()->with('error', 'Video yuklashda xatolik: ' . $e->getMessage());
        }
    }

    public function students()
    {
        $user = Auth::user();

        // Students are users from course_student and group_student where teacher owns course/group
        $courseIds = Course::where('user_id', $user->id)->pluck('id')->toArray();
        $groupIds = Group::where('teacher_id', $user->id)->pluck('id')->toArray();

        $courseUserIds = DB::table('course_student')->whereIn('course_id', $courseIds)->pluck('user_id')->toArray();
        $groupUserIds = DB::table('group_student')->whereIn('group_id', $groupIds)->pluck('student_id')->toArray();

        $userIds = array_unique(array_merge($courseUserIds, $groupUserIds));
        $students = User::whereIn('id', $userIds)->get();

        return view('teacher.sections.students', compact('students'));
    }

    public function chats()
    {
        $user = Auth::user();
        $groups = Group::withCount('students')
            ->where('teacher_id', $user->id)
            ->with(['messages' => fn($q) => $q->latest()->limit(1)])
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

        return view('teacher.sections.chats', compact('groups', 'selectedGroup', 'messages'));
    }

    public function sendChatMessage(SendChatMessageRequest $request)
    {

        $group = Group::findOrFail($request->group_id);
        $user = Auth::user();

        if ($group->teacher_id !== $user->id) {
            return response()->json(['message' => 'Ruxsat yo‘q'], 403);
        }

        $message = GroupMessage::create([
            'group_id' => $request->group_id,
            'user_id' => $user->id,
            'message' => $request->message,
        ]);

        event(new \App\Events\NewGroupMessage($message));

        if ($request->ajax() || $request->wantsJson()) {
            $messages = GroupMessage::with('user')
                ->where('group_id', $group->id)->latest()->limit(100)->get()->reverse();

            $html = view('admin.sections.chat-window', ['selectedGroup' => $group, 'messages' => $messages])->render();

            return response()->json([
                'html' => $html,
                'group_id' => $group->id,
                'last_message' => $message->message,
                'last_time' => $message->created_at->diffForHumans(),
                'messages_count' => GroupMessage::where('group_id', $group->id)->count(),
                'last_message_id' => $message->id,
                'message_html' => view('admin.sections.partials.message', ['msg' => $message])->render(),
                'message_id' => $message->id,
            ]);
        }

        return back();
    }

    public function loadGroupChat($id)
    {
        $user = Auth::user();
        $group = Group::where('id', $id)->where('teacher_id', $user->id)->firstOrFail();

        // AJAX emas bo'lsa — chats sahifasiga qaytaramiz
        if (!request()->ajax() && !request()->wantsJson()) {
            return redirect()->route('teacher.chats');
        }

        $messages = GroupMessage::with('user')
            ->where('group_id', $id)
            ->latest()
            ->limit(100)
            ->get()
            ->reverse();

        $html = view('admin.sections.chat-window', [
            'selectedGroup' => $group,
            'messages' => $messages
        ])->render();

        return response()->json([
            'html' => $html,
            'group_id' => $group->id,
            'last_message_id' => optional($messages->last())->id ?? null,
        ]);
    }

    public function pollGroupMessages($id, Request $request)
    {
        $user = Auth::user();
        $group = Group::where('id', $id)->where('teacher_id', $user->id)->firstOrFail();

        $lastId = (int) $request->query('last_id', 0);
        $messages = GroupMessage::with('user')->where('group_id', $id)
            ->when($lastId > 0, fn($q) => $q->where('id', '>', $lastId))
            ->orderBy('id')->get();

        $html = '';
        foreach ($messages as $msg) {
            $html .= view('admin.sections.partials.message', ['msg' => $msg])->render();
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
    }
    // app/Http/Controllers/TeacherController.php

    public function storeQuiz(StoreQuizRequest $request)
    {
        $validated = $request->validated();

        // Quiz yaratish
        $quiz = Quiz::create([
            'course_id' => $validated['course_id'],
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'time_limit_minutes' => $validated['time_limit_minutes'] ?? null,
            'passing_score_percentage' => $validated['passing_score_percentage'],
        ]);

        // Savollarni qo'shish
        foreach ($validated['questions'] as $questionData) {
            Question::create([
                'quiz_id' => $quiz->id,
                'question' => $questionData['question_text'] ?? $questionData['question'],
                'option_a' => $questionData['option_a'],
                'option_b' => $questionData['option_b'],
                'option_c' => $questionData['option_c'],
                'option_d' => $questionData['option_d'],
                'correct_answer' => $questionData['correct_answer'],
                'points' => $questionData['points'],
            ]);
        }

        return back()->with('success', 'Test muvaffaqiyatli qo\'shildi!');
    }

    public function destroyQuiz($id)
    {
        $quiz = Quiz::findOrFail($id);

        // Faqat o'z quizini o'chirishi mumkin
        if ($quiz->course->teacher_id !== auth()->id()) {
            return back()->with('error', 'Ruxsat yo\'q');
        }

        $quiz->delete(); // Cascade bilan savollar ham o'chadi

        return back()->with('success', 'Test o\'chirildi');
    }


    public function createVideo($courseId)
    {
        $course = Auth::user()->courses()->find($courseId);
        if (!$course) {
            return redirect()->route('teacher.courses')->with('error', 'Kurs topilmadi.');
        }
        return view('teacher.videos.create', compact('course'));
    }

    // Quiz yaratish sahifasini ko'rsatish
    public function createQuiz($courseId)
    {
        $course = Auth::user()->courses()->find($courseId);
        if (!$course) {
            return redirect()->route('teacher.courses')->with('error', 'Kurs topilmadi.');
        }

        // Faqat theory kurslarga ruxsat berish
        if ($course->course_type !== 'theory') {
            return redirect()->route('teacher.courses')
                ->with('error', 'Bu kurs turi uchun quiz qo\'shib bo\'lmaydi.');
        }

        return view('teacher.quizzes.create', compact('course'));
    }
}
