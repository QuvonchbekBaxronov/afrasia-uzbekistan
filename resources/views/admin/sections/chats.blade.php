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
                <input type="text" class="form-control form-control-sm rounded-pill" placeholder="Guruh nomini qidirish..."
                    id="search">
            </div>

            <div class="flex-grow-1 overflow-auto" id="groupsList">
                @forelse($groups as $group)
                    <a href="{{ route('teacher.chats.group', $group->id) }}"
                        class="group-chat-item d-flex align-items-center p-3 border-bottom text-decoration-none
                          {{ $selectedGroup?->id == $group->id ? 'active' : '' }}"
                        data-group-id="{{ $group->id }}">

                        <img src="https://ui-avatars.com/api/?name={{ urlencode($group->name) }}&background=random&color=fff&bold=true"
                            class="rounded-circle me-3 flex-shrink-0" width="46" height="46"
                            alt="{{ $group->name }}">

                        <div class="flex-grow-1 overflow-hidden">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="mb-0 text-truncate group-name">{{ $group->name }}</h6>
                                <small class="text-muted ms-2 flex-shrink-0 message-time">
                                    {{ $group->messages->first()?->created_at->diffForHumans() ?? '' }}
                                </small>
                            </div>
                            <small class="text-muted d-block text-truncate last-message">
                                @if ($group->messages->first()?->message)
                                    {{ Str::limit($group->messages->first()->message, 40) }}
                                @else
                                    Hali xabar yo'q
                                @endif
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

        .group-chat-item:hover {
            background-color: #f8f9fa;
        }

        .group-chat-item.active {
            background-color: #e3f2fd;
            border-left: 4px solid #0d6efd;
        }

        .message-item {
            display: flex;
            gap: 12px;
            margin-bottom: 18px;
            align-items: flex-start;
        }

        .message-item.sent {
            flex-direction: row-reverse;
        }

        .message-content {
            padding: 10px 15px;
            border-radius: 18px;
            max-width: 70%;
            word-break: break-word;
            background: #f1f3f5;
        }

        .message-item.sent .message-content {
            background: #0d6efd;
            color: white;
        }

        .message-meta {
            font-size: 0.8rem;
            color: #6c757d;
            margin-bottom: 4px;
        }
    </style>
@endsection

@section('scripts')
<script>
document.addEventListener('DOMContentLoaded', function () {

    let currentGroupId = {{ $selectedGroup ? $selectedGroup->id : 'null' }};
    let lastId = 0;
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
    // GROUP CLICK (AJAX LOAD)
    // ===============================
    function bindGroupLinks() {
        document.querySelectorAll('.group-chat-item').forEach(el => {
            el.onclick = function (e) {
                e.preventDefault();

                // Eski pollingni to'xtatamiz
                stopPolling();

                const groupId = this.dataset.groupId;
                const url = this.getAttribute('href');

                // Active class yangilash
                document.querySelectorAll('.group-chat-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');

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
                        const text = await r.text();
                        console.error('JSON o\'rniga boshqa narsa keldi:', text);
                        throw { message: 'Chat yuklanmadi. Sahifani yangilang.' };
                    }
                    if (!r.ok) {
                        const err = await r.json().catch(() => ({ message: 'Server error' }));
                        throw err;
                    }
                    return r.json();
                })
                .then(data => {
                    // Chat oynasini yangilaymiz
                    document.getElementById('chatContainer').innerHTML = data.html;

                    currentGroupId = groupId;
                    lastId = data.last_message_id || 0;

                    // Qayta bind va init — MUHIM
                    bindGroupLinks();
                    initChatWindow();
                })
                .catch(err => {
                    console.error(err);
                    alert(err.message || 'Xatolik yuz berdi');
                });
            };
        });
    }

    // ===============================
    // CHAT INIT
    // ===============================
    function initChatWindow() {

        // Avval eski pollingni to'xtatamiz
        stopPolling();

        const messagesBox = document.getElementById('messagesBox');
        const sendBtn = document.getElementById('chatSendBtn');
        const messageInput = document.getElementById('chatMessageInput');

        // Pastga scroll
        if (messagesBox) {
            messagesBox.scrollTop = messagesBox.scrollHeight;
        }

        if (sendBtn && messageInput) {
            // Eski event listenerlarni tozalaymiz (clone trick)
            const newSendBtn = sendBtn.cloneNode(true);
            sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);

            const newInput = messageInput.cloneNode(true);
            messageInput.parentNode.replaceChild(newInput, messageInput);

            setupSendMessage(newSendBtn, newInput, messagesBox);
        }

        // Polling boshlash
        if (currentGroupId) {
            startPolling(messagesBox);
        }
    }

    // ===============================
    // SEND MESSAGE
    // ===============================
    function setupSendMessage(sendBtn, messageInput, messagesBox) {

        const doSend = () => {
            const token = document.querySelector('meta[name="csrf-token"]').content;
            const message = messageInput.value.trim();

            if (!message || !currentGroupId) return;

            sendBtn.disabled = true;

            const fd = new FormData();
            fd.append('group_id', currentGroupId);
            fd.append('message', message);

            fetch('/teacher/chats/send', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': token,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                },
                body: fd
            })
            .then(async r => {
                if (r.status === 401 || r.status === 419) {
                    throw { message: 'Sessiya tugagan' };
                }
                const ct = r.headers.get('content-type') || '';
                if (!ct.includes('application/json')) {
                    const text = await r.text();
                    console.error('Send error:', text);
                    throw { message: 'Xabar yuborilmadi' };
                }
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
                    messageInput.value = '';

                    if (data.message_id) {
                        lastId = data.message_id;
                    }
                }

                // Guruh preview yangilash
                const item = document.querySelector(`.group-chat-item[data-group-id="${currentGroupId}"]`);
                if (item && data.last_message) {
                    const lm = item.querySelector('.last-message');
                    const lt = item.querySelector('.message-time');
                    if (lm) lm.textContent = data.last_message;
                    if (lt) lt.textContent = data.last_time ?? '';
                }
            })
            .catch(err => {
                console.error(err);
                alert(err.message || 'Xatolik');
            })
            .finally(() => {
                sendBtn.disabled = false;
            });
        };

        sendBtn.onclick = doSend;

        messageInput.onkeydown = e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                doSend();
            }
        };
    }

    // ===============================
    // POLLING
    // ===============================
    function startPolling(messagesBox) {

        pollTimer = setInterval(() => {
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
                    lastId = data.last_message_id;
                }

                // Guruh preview yangilash
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
        document.querySelectorAll('.group-chat-item').forEach(item => {
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