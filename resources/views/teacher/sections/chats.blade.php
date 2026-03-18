{{-- resources/views/teacher/sections/chats.blade.php --}}
@extends('teacher.layout')

@section('title', 'Guruh Chatlari')
@section('page-title', 'Guruh Chatlari')

@section('content')
    <div class="row g-0" style="height:calc(100vh - 150px); overflow:hidden;">

        {{-- CHAP: Guruhlar ro'yxati --}}
        <div class="col-lg-4 border-end d-flex flex-column" style="height:100%;">

            <div class="p-3 border-bottom bg-white">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0 fw-semibold">Mening Guruhlarim</h5>
                </div>
                <input type="text" class="form-control form-control-sm rounded-pill"
                    placeholder="Guruh nomini qidirish..." id="search">
            </div>

            <div class="flex-grow-1 overflow-auto" id="groupsList">
                @forelse($groups as $group)
                    <a href="{{ route('teacher.chats.group', $group->id) }}"
                        class="group-chat-item d-flex align-items-center p-3 border-bottom text-decoration-none {{ $selectedGroup?->id == $group->id ? 'active' : '' }}"
                        data-group-id="{{ $group->id }}">

                        <img src="https://ui-avatars.com/api/?name={{ urlencode($group->name) }}&background=random&color=fff&bold=true"
                            class="rounded-circle me-3 flex-shrink-0" width="46" height="46" alt="{{ $group->name }}">

                        <div class="flex-grow-1 overflow-hidden">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="mb-0 text-truncate group-name">{{ $group->name }}</h6>
                                <small class="text-muted ms-2 flex-shrink-0 message-time">
                                    {{ $group->messages->first()?->created_at->diffForHumans() ?? '' }}
                                </small>
                            </div>
                            <small class="text-muted d-block text-truncate last-message">
                                {{ $group->messages->first()?->message ? Str::limit($group->messages->first()->message, 40) : 'Hali xabar yo\'q' }}
                            </small>
                        </div>

                        @if ($group->messages_count > 0)
                            <span class="badge bg-primary rounded-pill ms-2">{{ $group->messages_count }}</span>
                        @endif
                    </a>
                @empty
                    <div class="text-center py-5 text-muted">
                        <i class="fas fa-users fa-3x mb-3 opacity-25"></i>
                        <p class="mb-0">Hozircha guruhlaringiz yo'q</p>
                    </div>
                @endforelse
            </div>
        </div>

        {{-- O'NG: Chat oynasi --}}
        <div class="col-lg-8 d-flex flex-column" id="chatContainer" style="height:100%;">
            @include('teacher.sections.chat-window')
        </div>
    </div>
@endsection

@section('styles')
    <style>
        .group-chat-item {
            cursor: pointer;
            transition: all 0.2s;
            color: #212529;
        }
        .group-chat-item:hover { background-color: #f8f9fa; }
        .group-chat-item.active {
            background-color: #e3f2fd;
            border-left: 4px solid #0d6efd;
        }
    </style>
@endsection

@section('scripts')
<script>
document.addEventListener('DOMContentLoaded', function () {

    let currentGroupId = {{ $selectedGroup ? $selectedGroup->id : 'null' }};
    let lastId = Number(document.getElementById('lastMessageId')?.value || 0);
    let pollTimer = null;

    // ===============================
    // POLLING TO'XTATISH
    // ===============================
    function stopPolling() {
        if (pollTimer) {
            clearInterval(pollTimer);
            pollTimer = null;
        }
    }

    // ===============================
    // GROUP CLICK
    // ===============================
    function bindGroupLinks() {
        document.querySelectorAll('.group-chat-item').forEach(function (el) {
            el.onclick = function (e) {
                e.preventDefault();
                stopPolling();

                const groupId = el.dataset.groupId;
                const url = el.getAttribute('href');

                document.querySelectorAll('.group-chat-item').forEach(i => i.classList.remove('active'));
                el.classList.add('active');

                fetch(url, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    }
                })
                .then(async r => {
                    if (r.status === 401 || r.status === 419) {
                        throw { message: 'Sessiya tugagan. Qayta login qiling.' };
                    }
                    const ct = r.headers.get('content-type') || '';
                    if (!ct.includes('application/json')) {
                        throw { message: 'Chat yuklanmadi. Sahifani yangilang.' };
                    }
                    if (!r.ok) {
                        const err = await r.json().catch(() => ({ message: 'Server error' }));
                        throw err;
                    }
                    return r.json();
                })
                .then(data => {
                    document.getElementById('chatContainer').innerHTML = data.html;
                    currentGroupId = groupId;
                    lastId = Number(data.last_message_id) || 0;

                    // Guruh preview yangilash
                    if (data.last_message) {
                        const item = document.querySelector(`.group-chat-item[data-group-id="${groupId}"]`);
                        if (item) {
                            const lm = item.querySelector('.last-message');
                            const lt = item.querySelector('.message-time');
                            if (lm) lm.textContent = data.last_message;
                            if (lt) lt.textContent = data.last_time ?? '';
                        }
                    }

                    bindGroupLinks();
                    initChatWindow();
                })
                .catch(err => {
                    console.error('Load chat error', err);
                    alert(err?.message || 'Guruh yuklanmadi.');
                });
            };
        });
    }

    // ===============================
    // CHAT INIT
    // ===============================
    function initChatWindow() {
        stopPolling();

        const messagesBox = document.getElementById('messagesBox');

        if (messagesBox) {
            messagesBox.scrollTop = messagesBox.scrollHeight;
        }

        // lastId yangilash
        const lastInput = document.getElementById('lastMessageId');
        if (lastInput && lastInput.value) {
            lastId = Number(lastInput.value);
        }

        // Form — id="teacherChatForm" bo'lishi kerak chat-window.blade.php da
        const form = document.getElementById('teacherChatForm');
        if (form) {
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);
            setupSendMessage(newForm, messagesBox);
        }

        if (currentGroupId) {
            startPolling(messagesBox);
        }
    }

    // ===============================
    // SEND MESSAGE
    // ===============================
    function setupSendMessage(form, messagesBox) {
        form.onsubmit = function (e) {
            e.preventDefault();

            const token = document.querySelector('meta[name="csrf-token"]').content;
            const messageInput = form.querySelector('input[name="message"]');
            const message = messageInput?.value?.trim();

            if (!message || !currentGroupId) return;

            const submitBtn = form.querySelector('[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            fetch(form.action, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': token,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                },
                body: new FormData(form)
            })
            .then(async r => {
                if (r.status === 401 || r.status === 419) throw { message: 'Sessiya tugagan' };
                const ct = r.headers.get('content-type') || '';
                if (!ct.includes('application/json')) throw { message: 'Xabar yuborilmadi' };
                if (!r.ok) {
                    const err = await r.json().catch(() => ({ message: 'Server error' }));
                    throw err;
                }
                return r.json();
            })
            .then(data => {
                if (data.message_html && messagesBox) {
                    messagesBox.insertAdjacentHTML('beforeend', data.message_html);
                    messagesBox.scrollTop = messagesBox.scrollHeight;
                }

                if (messageInput) messageInput.value = '';

                if (data.message_id) {
                    lastId = Number(data.message_id);
                    const lastInput = document.getElementById('lastMessageId');
                    if (lastInput) lastInput.value = lastId;
                }

                // Guruh preview
                if (data.group_id) {
                    const item = document.querySelector(`.group-chat-item[data-group-id="${data.group_id}"]`);
                    if (item) {
                        const lm = item.querySelector('.last-message');
                        const lt = item.querySelector('.message-time');
                        if (lm && data.last_message) lm.textContent = data.last_message;
                        if (lt && data.last_time) lt.textContent = data.last_time;
                    }
                }
            })
            .catch(err => {
                console.error('Send error', err);
                alert(err?.message || 'Xatolik');
            })
            .finally(() => {
                if (submitBtn) submitBtn.disabled = false;
            });
        };
    }

    // ===============================
    // POLLING
    // ===============================
    function startPolling(messagesBox) {
        pollTimer = setInterval(function () {
            if (!currentGroupId) return;

            fetch(`/teacher/chats/${currentGroupId}/poll?last_id=${lastId}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            })
            .then(async r => {
                if (!r.ok) return;
                const ct = r.headers.get('content-type') || '';
                if (!ct.includes('application/json')) return;
                return r.json();
            })
            .then(data => {
                if (!data) return;

                if (data.html && messagesBox) {
                    messagesBox.insertAdjacentHTML('beforeend', data.html);
                    messagesBox.scrollTop = messagesBox.scrollHeight;
                }

                if (data.last_message_id) {
                    lastId = Number(data.last_message_id);
                    const lastInput = document.getElementById('lastMessageId');
                    if (lastInput) lastInput.value = lastId;
                }

                if (data.last_message) {
                    const item = document.querySelector(`.group-chat-item[data-group-id="${currentGroupId}"]`);
                    if (item) {
                        const lm = item.querySelector('.last-message');
                        const lt = item.querySelector('.message-time');
                        if (lm) lm.textContent = data.last_message;
                        if (lt) lt.textContent = data.last_time ?? '';
                    }
                }
            })
            .catch(() => {});
        }, 3000);
    }

    // ===============================
    // SEARCH
    // ===============================
    document.getElementById('search')?.addEventListener('input', function () {
        const q = this.value.toLowerCase();
        document.querySelectorAll('.group-chat-item').forEach(function (item) {
            const name = item.querySelector('.group-name')?.textContent?.toLowerCase() || '';
            item.style.display = name.includes(q) ? '' : 'none';
        });
    });

    // ===============================
    // START
    // ===============================
    bindGroupLinks();
    initChatWindow();
});
</script>
@endsection