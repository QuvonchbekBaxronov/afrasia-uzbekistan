{{-- resources/views/teacher/sections/partials/message.blade.php --}}
@php
    $isSent = $msg->user_id === auth()->id();
@endphp

<div style="display:flex; flex-direction:{{ $isSent ? 'row-reverse' : 'row' }}; align-items:flex-end; gap:8px;" 
     data-message-id="{{ $msg->id }}">

    {{-- Avatar --}}
    @if(!$isSent)
    <img src="https://ui-avatars.com/api/?name={{ urlencode($msg->user?->name ?? 'U') }}&background=random&color=fff&bold=true"
        style="width:32px; height:32px; border-radius:50%; flex-shrink:0;">
    @endif

    <div style="max-width:65%;">
        {{-- Sender name (faqat boshqa odamlar uchun) --}}
        @if(!$isSent)
        <div style="font-size:11px; color:#64748b; margin-bottom:4px; {{ $isSent ? 'text-align:right' : '' }}">
            {{ $msg->user?->name ?? 'Noma\'lum' }}
        </div>
        @endif

        {{-- Bubble --}}
        <div style="
            padding: 10px 14px;
            border-radius: {{ $isSent ? '18px 18px 4px 18px' : '18px 18px 18px 4px' }};
            background: {{ $isSent ? '#0d6efd' : '#fff' }};
            color: {{ $isSent ? '#fff' : '#1e293b' }};
            font-size: 14px;
            line-height: 1.5;
            word-break: break-word;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
            border: {{ $isSent ? 'none' : '1px solid #e2e8f0' }};
        ">
            {{ $msg->message }}
        </div>

        {{-- Vaqt --}}
        <div style="font-size:11px; color:#94a3b8; margin-top:4px; text-align:{{ $isSent ? 'right' : 'left' }};">
            {{ $msg->created_at->format('H:i') }}
        </div>
    </div>
</div>