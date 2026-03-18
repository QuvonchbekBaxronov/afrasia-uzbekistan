{{-- resources/views/teacher/sections/chat-window.blade.php --}}
@php
    $groupVar = $selectedGroup ?? ($group ?? null);
@endphp

@if($groupVar)
<div class="card" style="height:calc(100vh - 150px); display:flex; flex-direction:column;">

    {{-- HEADER --}}
    <div class="chat-window-header" style="padding:16px 20px; border-bottom:1px solid #e2e8f0; background:#fff; display:flex; align-items:center; gap:15px; flex-shrink:0;">
        <img src="https://ui-avatars.com/api/?name={{ urlencode($groupVar->name) }}&background=random&color=fff&bold=true"
            style="width:46px; height:46px; border-radius:50%; flex-shrink:0;">
        <div>
            <h5 style="margin:0; font-weight:700; font-size:16px;">{{ $groupVar->name }}</h5>
            <p style="margin:0; color:#64748b; font-size:13px;">
                {{ $groupVar->students_count ?? $groupVar->current_students ?? 0 }} o'quvchi
            </p>
        </div>
    </div>

    {{-- MESSAGES --}}
    <div id="messagesBox"
        style="flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:12px; background:#f8fafc;">
        @forelse($messages as $msg)
            @include('teacher.sections.message', ['msg' => $msg])
        @empty
            <div style="text-align:center; color:#94a3b8; margin:auto;">
                <i class="fas fa-comments" style="font-size:48px; margin-bottom:12px; display:block; opacity:0.3;"></i>
                <p>Hozircha xabar yo'q</p>
            </div>
        @endforelse
    </div>

    {{-- INPUT --}}
    {{-- ❗ id="teacherChatForm" — JS bilan mos bo'lishi SHART --}}
    <form action="{{ route('teacher.chats.send') }}" method="POST" id="teacherChatForm"
        style="padding:16px 20px; border-top:1px solid #e2e8f0; background:#fff; display:flex; gap:10px; align-items:center; flex-shrink:0;">
        @csrf
        <input type="hidden" name="group_id" value="{{ $groupVar->id }}">
        <input type="hidden" id="lastMessageId" value="{{ $messages->last()?->id ?? '' }}">

        <input type="text" name="message" autocomplete="off" placeholder="Xabar yozing..."
            style="flex:1; border:1px solid #e2e8f0; border-radius:24px; padding:10px 18px; outline:none; font-size:14px;"
            required>

        <button type="submit"
            style="background:#0d6efd; color:#fff; border:none; border-radius:24px; padding:10px 22px; cursor:pointer; font-size:14px; font-weight:600; white-space:nowrap;">
            Yuborish
        </button>
    </form>

</div>
@else
<div style="display:flex; align-items:center; justify-content:center; height:100%;">
    <div style="text-align:center; color:#94a3b8;">
        <i class="fas fa-comments" style="font-size:56px; margin-bottom:16px; display:block; opacity:0.3;"></i>
        <h5 style="color:#64748b;">Guruh tanlang</h5>
        <p style="font-size:13px;">Chap tomondagi guruhlar ro'yxatidan birini tanlang</p>
    </div>
</div>
@endif