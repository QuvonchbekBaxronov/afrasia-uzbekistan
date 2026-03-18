<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\GroupMessage;
use App\Models\Payment;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Admin\AdminUpdateUserPasswordRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Requests\Admin\StoreTeacherRequest;
use App\Http\Requests\Admin\StoreGroupRequest;
use App\Http\Requests\Admin\SendChatMessageRequest;

class AdminController extends Controller
{
    public function admin_panel()
    {
        return view('admin.sections.dashboard'); // admin/
    }

    public function dashboard()
    {

        $user = Auth::user();

        if (!$user) {
            return redirect('/')->with('error', 'XAtolik yuz berdi');
        }

        $user_count = User::where('role', 'user')->count();

        $active_users = User::where('role', 'user')->where('status', true)->count();

        $active_group = Group::where('status', 'active')->count();

        $price_sum = Payment::where('status', 'completed')->sum('amount');

        $new_users = User::where('role', 'user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $currentYear = Carbon::now()->year;

        $monthlyPayments = Payment::where('status', 'completed')
            ->whereYear('created_at', $currentYear)
            ->selectRaw('EXTRACT(MONTH FROM created_at) as month, SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('total', 'month');


        return view('admin.sections.dashboard', compact(
            'user_count',
            'active_users',
            'active_group',
            'price_sum',
            'new_users',
            'monthlyPayments'
        ));
    }

    public function users()
    {
        $user = Auth::user();


        if (!$user) {
            return redirect('/')->with('error', 'XAtolik yuz berdi');
        }

        $users = User::select(
            'id',
            'name',
            'email',
            'role',
            'phone',
            'created_at',
            'status',
        )
            ->where('role', 'user')
            ->get();


        return view('admin.sections.users', compact('users'));
    }

    public function teachers()
    {
        $user = Auth::user();

        if (!$user || !$user->is_admin) {
            return redirect('/')->with('error', 'Ruxsat yo‘q');
        }

        $teachers = User::query()
            ->select([
                'users.id',
                'users.name',
                'users.email',
                'users.phone',
                'users.status',
            ])
            ->selectSub(function ($query) {
                $query->selectRaw('COUNT(groups.id)')
                    ->from('groups')
                    ->whereColumn('groups.teacher_id', 'users.id');
            }, 'group_count')
            // Fan ma’lumoti — hozircha subject_id yo‘q, shuning uchun subquery orqali olamiz
            ->selectSub(function ($query) {
                $query->select('subjects.name')
                    ->from('subjects')
                    ->whereColumn('subjects.teacher_id', 'users.id')
                    ->limit(1);
            }, 'subject_name')
            ->where('users.role', 'teacher')
            ->get();

        $subjects = Subject::all(); // yangi o‘qituvchi qo‘shish uchun

        return view('admin.sections.teachers', compact('teachers', 'subjects'));
    }
    public function groups()
    {

        $groups = Group::with('teacher')
            ->withCount(['students as current_students'])
            ->latest()
            ->get();

        $teachers = User::query()
            ->select(['users.id', 'users.name'])
            ->selectSub(function ($query) {
                $query->select('subjects.name')
                    ->from('subjects')
                    ->whereColumn('subjects.teacher_id', 'users.id')
                    ->limit(1);
            }, 'subject_name')
            ->where('role', 'teacher')
            ->orderBy('name')
            ->get();

        return view('admin.sections.groups', compact('groups', 'teachers'));
    }


    public function statistics()
    {
        return view('admin.sections.statistics');
    }

    public function payments()
    {
        return view('admin.sections.payments');
    }

    public function settings()
    {
        return view('admin.sections.settings');
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return view('admin.sections.user-show', compact('user'));
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);
        return view('admin.sections.user-edit', compact('user'));
    }

    public function update(UpdateUserRequest $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->validated());
        return back()->with('success', 'Malumotlar yangilandi');
    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return back()->with('success', 'Foydalanuvchi o\'chirildi');
    }

    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        $user->status = !$user->status;
        $user->save();
        return back()->with('success', 'Status o\'zgartirildi');
    }

    public function updatePassword(AdminUpdateUserPasswordRequest $request, $id)
    {
        $validated = $request->validated();
        $user = User::findOrFail($id);
        $user->password = bcrypt($validated['password']);
        $user->save();
        return back()->with('success', 'Parol yangilandi');
    }

    public function store(StoreUserRequest $request)
    {
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'role' => $request->role ?? 'user',
            'password' => bcrypt($request->password),
            'status' => 1,
        ]);

        return back()->with('success', 'Yangi foydalanuvchi qo\'shildi');
    }
    public function teacher_destroy($id)
    {
        Teacher::findOrFail($id)->delete();
        return back()->with('success', 'O\'qituvchi o\'chirildi');
    }

    public function teacher_store(StoreTeacherRequest $request)
    {
        Log::info('Yangi o‘qituvchi qo‘shish so‘rovi', ['request' => $request->all()]);

        $teacher = User::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'phone'      => $request->phone,
            'role'       => 'teacher',
            'password'   => Hash::make($request->password),
            'is_teacher' => true,
            'status'     => true,
        ]);

        Subject::create([
            'name'       => $request->subject,
            'teacher_id' => $teacher->id,
        ]);

        return redirect()->route('admin.teachers')
            ->with('success', 'Yangi o‘qituvchi muvaffaqiyatli qo‘shildi!');
    }

    public function chats()
    {
        $groups = Group::with('teacher')
            ->withCount('messages as messages_count')
            // eager-load only the latest message per group
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

        return view('admin.sections.chats', compact('groups', 'selectedGroup', 'messages'));
    }

    public function sendChatMessage(SendChatMessageRequest $request)
    {
        $message = GroupMessage::create([
            'group_id' => $request->group_id,
            'user_id'  => auth()->id(),
            'message'  => $request->message,
        ]);

        // Broadcast the new message to websocket listeners
        event(new \App\Events\NewGroupMessage($message));

        if ($request->ajax() || $request->wantsJson()) {
            $selectedGroup = Group::with('teacher')->findOrFail($request->group_id);

            $messages = GroupMessage::with('user')
                ->where('group_id', $selectedGroup->id)
                ->latest()
                ->limit(100)
                ->get()
                ->reverse();

            $html = view('admin.sections.chat-window', compact('selectedGroup', 'messages'))->render();

            return response()->json([
                'html' => $html,
                'group_id' => $selectedGroup->id,
                'last_message' => $message->message,
                'last_time' => $message->created_at->diffForHumans(),
                'messages_count' => GroupMessage::where('group_id', $selectedGroup->id)->count(),
                'last_message_id' => $message->id,
                'message_html' => view('admin.sections.partials.message', ['msg' => $message])->render(),
                'message_id' => $message->id,
            ]);
        }

        return back();
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

            $html = view('admin.sections.chat-window', compact('selectedGroup', 'messages'))->render();

            if (request()->ajax() || request()->wantsJson()) {
                return response()->json([
                    'html' => $html,
                    'group_id' => $selectedGroup->id,
                    'last_message' => optional($messages->last())->message ?? null,
                    'last_time' => optional($messages->last())->created_at?->diffForHumans() ?? null,
                    'last_user_id' => optional($messages->last())->user_id ?? null,
                    'messages_count' => GroupMessage::where('group_id', $id)->count(),
                    'last_message_id' => optional($messages->last())->id ?? null,
                ]);
            }

            return view('admin.sections.chat-window', compact('selectedGroup', 'messages'));
        } catch (\Throwable $e) {
            Log::error('loadGroupChat error', ['id' => $id, 'error' => $e->getMessage()]);
            if (request()->ajax() || request()->wantsJson()) {
                return response()->json(['message' => 'Guruhni yuklashda server xatosi yuz berdi. Iltimos, sahifani yangilang.'], 500);
            }
            throw $e;
        }
    }
    public function pollGroupMessages($id, Request $request)
    {
        try {
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
                $html .= view('admin.sections.partials.message', compact('msg'))->render();
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
            Log::error('pollGroupMessages error', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Polling xatosi'], 500);
        }
    }
    public function storeGroup(StoreGroupRequest $request)
    {
        Group::create($request->validated());

        return redirect()->route('admin.groups')->with('success', 'Yangi guruh muvaffaqiyatli qoʻshildi!');
    }
}
