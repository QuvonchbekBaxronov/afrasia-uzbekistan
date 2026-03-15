{{-- resources/views/student/sections/chat-window.blade.php --}}
@if($selectedGroup ?? false)
<div class="card border-0 shadow-none" style="height:calc(100vh - 150px); display:flex; flex-direction:column;">

    {{-- Chat Header --}}
    <div class="card-header bg-white border-bottom d-flex align-items-center gap-3">
        <img src="https://ui-avatars.com/api/?name={{ urlencode($selectedGroup->name) }}&background=random&color=fff&bold=true"
             class="rounded-circle flex-shrink-0" width="46" height="46" alt="{{ $selectedGroup->name }}">
        <div>
            <h5 class="mb-0 fw-semibold">{{ $selectedGroup->name }}</h5>
            <small class="text-muted">
                O'qituvchi: {{ $selectedGroup->teacher->name ?? 'Noma\'lum' }}
            </small>
        </div>
    </div>

    {{-- Messages Area --}}
    <div class="flex-grow-1 p-3" id="messagesBox" style="overflow-y:auto; scroll-behavior:smooth;">
        @forelse($messages ?? [] as $msg)
            <div class="message-item {{ $msg->user_id == auth()->id() ? 'sent' : 'received' }}"
                 data-message-id="{{ $msg->id }}">
                <img src="https://ui-avatars.com/api/?name={{ urlencode($msg->user->name ?? 'U') }}&background=random&color=fff"
                     class="rounded-circle flex-shrink-0" width="34" height="34" alt="{{ $msg->user->name ?? '' }}">
                <div>
                    <div class="message-meta">
                        <strong class="small">{{ $msg->user->name ?? 'Noma\'lum' }}</strong>
                        <span class="text-muted small ms-1">{{ $msg->created_at->format('H:i') }}</span>
                    </div>
                    <div class="message-content">{{ $msg->message }}</div>
                </div>
            </div>
        @empty
            <div class="text-center text-muted py-5">
                <i class="fas fa-comment-dots fa-3x mb-3 opacity-25"></i>
                <p class="mb-0">Hozircha xabar yo'q</p>
                <small>Birinchi xabarni yuboring!</small>
            </div>
        @endforelse
    </div>

    {{-- Input Area — <form> ishlatilmaydi (reload bo'lmasligi uchun) --}}
    <div class="border-top p-3 bg-white d-flex gap-2 align-items-center">
        <input type="hidden" id="chatGroupId"   value="{{ $selectedGroup->id }}">
        <input type="hidden" id="lastMessageId" value="{{ $messages->last()?->id ?? 0 }}">

        <input type="text"
               id="chatMessageInput"
               class="form-control rounded-pill"
               placeholder="Xabar yozing..."
               autocomplete="off">

        <button type="button"
                id="chatSendBtn"
                class="btn btn-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style="width:42px;height:42px;">
            <i class="fas fa-paper-plane"></i>
        </button>
    </div>
</div>

@else
<div class="card border-0 shadow-none d-flex align-items-center justify-content-center text-muted"
     style="height:calc(100vh - 150px);">
    <div class="text-center">
        <i class="fas fa-comments fa-4x mb-3 opacity-25"></i>
        <h5 class="fw-light">Guruh tanlang</h5>
        <p class="small mb-0">Chap tarafdan guruhni bosing</p>
    </div>
</div>
@endif