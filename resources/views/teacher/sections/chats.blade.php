{{-- resources/views/student/sections/chats.blade.php --}}
@extends('student.layout')

@section('title', 'Guruh Chatlari')
@section('page-title', 'Guruh Chatlari')

@section('content')
<div class="row g-0" style="height:calc(100vh - 150px); overflow:hidden;">

    {{-- ═══════════════════════════════════════════════
         CHAP: Guruhlar ro'yxati
    ═══════════════════════════════════════════════ --}}
    <div class="col-lg-4 border-end d-flex flex-column" style="height:100%;">

        <div class="p-3 border-bottom bg-white">
            <h5 class="mb-2 fw-semibold">Guruhlar</h5>
            <input type="text"
                   class="form-control form-control-sm rounded-pill"
                   placeholder="Qidirish..."
                   id="search">
        </div>

        <div class="flex-grow-1 overflow-auto" id="groupsList">
            @forelse($groups as $group)
                <a href="{{ route('student.chats.group', $group->id) }}"
                   class="group-chat-item d-flex align-items-center p-3 border-bottom text-decoration-none
                          {{ $selectedGroup?->id == $group->id ? 'active' : '' }}"
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
                            @if($group->messages->first()?->message)
                                {{ Str::limit($group->messages->first()->message, 35) }}
                            @else
                                Xabar yo'q
                            @endif
                        </small>
                    </div>

                    @if(($group->messages_count ?? 0) > 0)
                        <span class="badge bg-primary rounded-pill ms-2 flex-shrink-0 unread-badge">
                            {{ $group->messages_count }}
                        </span>
                    @endif
                </a>
            @empty
                <div class="text-center py-5 text-muted">
                    <i class="fas fa-comment-slash fa-3x mb-3 opacity-25"></i>
                    <p class="mb-0">Guruhlar yo'q</p>
                </div>
            @endforelse
        </div>
    </div>

    {{-- ═══════════════════════════════════════════════
         O'NG: Chat oynasi
    ═══════════════════════════════════════════════ --}}
    <div class="col-lg-8 d-flex flex-column" id="chatContainer" style="height:100%;">
        @include('student.sections.chat-window')
    </div>
</div>
@endsection


@section('styles')
<style>
    /* ── Guruh ro'yxati ── */
    .group-chat-item {
        cursor: pointer;
        transition: background 0.15s;
        color: #212529;
    }
    .group-chat-item:hover  { background-color: #f8f9fa; }
    .group-chat-item.active {
        background-color: #e8f0fe;
        border-left: 3px solid #0d6efd;
    }

    /* ── Xabarlar ── */
    .message-item {
        display: flex;
        gap: 10px;
        margin-bottom: 16px;
        align-items: flex-start;
    }
    .message-item.sent { flex-direction: row-reverse; }

    .message-meta { margin-bottom: 4px; }
    .message-item.sent .message-meta { text-align: right; }

    .message-content {
        display: inline-block;
        padding: 9px 14px;
        border-radius: 18px;
        line-height: 1.45;
        max-width: 400px;
        word-break: break-word;
        background: #f1f3f5;
        color: #212529;
    }
    .message-item.sent .message-content {
        background: #0d6efd;
        color: #fff;
    }

    /* ── Boshqa ── */
    #chatSendBtn:hover { opacity: 0.88; }
</style>
@endsection


@section('scripts')
<script>
document.addEventListener('DOMContentLoaded', function () {

    /* ══════════════════════════════════════════
       STATE
    ══════════════════════════════════════════ */
    let currentGroupId = {{ $selectedGroup ? $selectedGroup->id : 'null' }};
    let lastId         = 0;
    let pollTimer      = null;

    /* ══════════════════════════════════════════
       GURUH LINKLAR — click interceptor
    ══════════════════════════════════════════ */
    function bindGroupLinks() {
        document.querySelectorAll('.group-chat-item').forEach(el => {
            el.onclick = function (e) {
                e.preventDefault();            // ← sahifa o'TMASLIK uchun

                const url     = this.getAttribute('href');
                const groupId = this.dataset.groupId;

                document.querySelectorAll('.group-chat-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');

                fetch(url, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept'          : 'application/json'
                    }
                })
                .then(async r => {
                    const ct = r.headers.get('content-type') || '';
                    if (!ct.includes('application/json')) {
                        const txt = await r.text();
                        console.error('Server JSON emas:', txt.substring(0, 400));
                        throw new Error('Server xatosi. Route tekshiring.');
                    }
                    if (!r.ok) throw new Error(`HTTP ${r.status}`);
                    return r.json();
                })
                .then(data => {
                    document.getElementById('chatContainer').innerHTML = data.html;

                    currentGroupId = groupId;
                    lastId         = data.last_message_id || 0;

                    updateGroupPreview(data);
                    bindGroupLinks();
                    initChatWindow();
                })
                .catch(err => {
                    console.error('Guruh yuklanmadi:', err);
                    alert(err.message || 'Guruh yuklanmadi. Sahifani yangilang.');
                });
            };
        });
    }

    /* ══════════════════════════════════════════
       CHAT OYNASI — init
    ══════════════════════════════════════════ */
    function initChatWindow() {
        // Eski polling ni to'xtatish
        if (pollTimer) {
            clearInterval(pollTimer);
            pollTimer = null;
        }

        const messagesBox      = document.getElementById('messagesBox');
        const groupIdInput     = document.getElementById('chatGroupId');
        const lastMessageInput = document.getElementById('lastMessageId');
        const messageInput     = document.getElementById('chatMessageInput');
        const sendBtn          = document.getElementById('chatSendBtn');

        if (!groupIdInput) return; // guruh tanlanmagan

        currentGroupId = groupIdInput.value;
        if (lastMessageInput) lastId = Number(lastMessageInput.value || 0);

        // Scroll pastga
        if (messagesBox) messagesBox.scrollTop = messagesBox.scrollHeight;

        // Yuborish
        if (sendBtn && messageInput) {
            setupSendMessage(sendBtn, messageInput, messagesBox, lastMessageInput);
        }

        // Polling
        startPolling(messagesBox, lastMessageInput);
    }

    /* ══════════════════════════════════════════
       XABAR YUBORISH
    ══════════════════════════════════════════ */
    function setupSendMessage(sendBtn, messageInput, messagesBox, lastMessageInput) {

        const doSend = () => {
            const token   = document.querySelector('meta[name="csrf-token"]')?.content;
            const message = messageInput.value.trim();

            if (!token)   { alert('CSRF token yo\'q. Sahifani yangilang.'); return; }
            if (!message) return;

            sendBtn.disabled = true;

            const fd = new FormData();
            fd.append('group_id', currentGroupId);
            fd.append('message',  message);

            fetch('/student/chats/send', {
                method : 'POST',
                headers: {
                    'X-CSRF-TOKEN'    : token,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept'          : 'application/json'
                },
                body: fd
            })
            .then(async r => {
                const ct = r.headers.get('content-type') || '';
                if (!ct.includes('application/json')) {
                    const txt = await r.text();
                    console.error('Non-JSON:', txt.substring(0, 300));
                    throw new Error('Server xatosi (send)');
                }
                return r.json();
            })
            .then(data => {
                if (data.success && data.message_html && data.message_id) {
                    // Takrorlanishdan saqlash
                    if (!document.querySelector(`[data-message-id="${data.message_id}"]`) && messagesBox) {
                        messagesBox.insertAdjacentHTML('beforeend', data.message_html);
                        messagesBox.scrollTop = messagesBox.scrollHeight;
                    }
                    if (lastMessageInput) lastMessageInput.value = data.message_id;
                    lastId = data.message_id;

                    updateGroupPreview(data);
                    messageInput.value = '';
                } else {
                    alert(data.message || 'Xabar yuborilmadi');
                }
            })
            .catch(err => {
                console.error('Send error:', err);
                alert(err.message || 'Xatolik yuz berdi');
            })
            .finally(() => {
                sendBtn.disabled = false;
                messageInput.focus();
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

    /* ══════════════════════════════════════════
       POLLING
    ══════════════════════════════════════════ */
    function startPolling(messagesBox, lastMessageInput) {
        pollTimer = setInterval(() => {
            if (!currentGroupId) return;

            fetch(`/student/chats/${currentGroupId}/poll?last_id=${lastId}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept'          : 'application/json'
                }
            })
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(data => {
                if (data.html) {
                    const box = document.getElementById('messagesBox');
                    if (box) {
                        box.insertAdjacentHTML('beforeend', data.html);
                        box.scrollTop = box.scrollHeight;
                    }
                }

                if (data.last_message_id && data.last_message_id > lastId) {
                    lastId = data.last_message_id;
                    const lmi = document.getElementById('lastMessageId');
                    if (lmi) lmi.value = lastId;
                }

                if (data.last_message) updateGroupPreview(data);
            })
            .catch(() => {});
        }, 3000);
    }

    /* ══════════════════════════════════════════
       GURUH PREVIEW YANGILASH
    ══════════════════════════════════════════ */
    function updateGroupPreview(data) {
        const gid  = data.group_id || currentGroupId;
        const item = document.querySelector(`.group-chat-item[data-group-id="${gid}"]`);
        if (!item) return;

        const msgEl  = item.querySelector('.last-message');
        const timeEl = item.querySelector('.message-time');

        if (msgEl && data.last_message) {
            const preview = data.last_message.length > 35
                ? data.last_message.substring(0, 35) + '…'
                : data.last_message;
            msgEl.textContent = preview;
        }
        if (timeEl && data.last_time) {
            timeEl.textContent = data.last_time;
        }
    }

    /* ══════════════════════════════════════════
       QIDIRUV
    ══════════════════════════════════════════ */
    document.getElementById('search')?.addEventListener('input', function () {
        const q = this.value.toLowerCase();
        document.querySelectorAll('.group-chat-item').forEach(item => {
            const name = item.querySelector('.group-name')?.textContent.toLowerCase() || '';
            item.style.display = name.includes(q) ? '' : 'none';
        });
    });

    /* ══════════════════════════════════════════
       ISHGA TUSHIRISH
    ══════════════════════════════════════════ */
    bindGroupLinks();
    initChatWindow();
});
</script>
@endsection