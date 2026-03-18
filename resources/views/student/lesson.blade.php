@extends('student.layout')

@section('title', $video->title)
@section('page-title', $video->title)

@section('content')
<div class="video-player-container p-4">
    <div class="row g-4">
        <!-- VIDEO PLAYER -->
        <div class="col-lg-9">
            <div class="player-card bg-black rounded-4 shadow-lg overflow-hidden mb-4" style="max-height: 600px;">
                <video id="mainVideo" class="w-100" controls preload="metadata" 
                       style="height: 550px; object-fit: contain; background: #000;"
                       poster="{{ asset('img/video-poster.jpg') }}">
                    {{-- S3 yoki local video --}}
                    @php
                        $videoUrl = $video->resolved_url;
                    @endphp
                    <source src="{{ $videoUrl }}" type="video/mp4">
                    Video yuklanmadi. <a href="{{ $videoUrl }}" target="_blank">To'liq versiyani yuklab oling</a>
                </video>
            </div>
            
            <div class="video-info bg-white rounded-3 shadow p-4">
                <div class="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <h2 class="fw-bold mb-2">{{ $video->title }}</h2>
                        <p class="text-muted mb-1">{{ $video->course->title }}</p>
                        <div class="text-muted">
                            <i class="fas fa-clock me-1"></i>{{ gmdate('H:i:s', $video->duration_seconds ?? 0) }} | 
                            O'qituvchi: {{ $video->course->user->name }}
                        </div>
                    </div>
                    <button class="btn btn-success px-4 py-2 fw-bold" onclick="markComplete()">
                        <i class="fas fa-check me-1"></i>Tugallangan
                    </button>
                </div>
                <div class="description">
                    {!! nl2br(e($video->description ?? 'Dars tavsifi...')) !!}
                </div>
            </div>
        </div>

        <!-- KURS MAZMUNI -->
        <div class="col-lg-3">
            <div class="sticky-top" style="top: 100px;">
                <!-- Joriy kurs -->
                <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-primary text-white p-3">
                        <h6 class="mb-0 fw-bold"><i class="fas fa-book me-2"></i>{{ $video->course->title }}</h6>
                    </div>
                    <div class="card-body p-3">
                        <div class="progress mb-2" style="height: 6px;">
                            <div class="progress-bar bg-success" style="width: {{ rand(40,80) }}%"></div>
                        </div>
                        <small class="text-success fw-bold">{{ rand(40,80) }}% tugallangan</small>
                    </div>
                </div>

                <!-- Keyingi darslar -->
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-info text-white p-3">
                        <h6 class="mb-0 fw-bold"><i class="fas fa-list me-2"></i>Keyingi darslar</h6>
                    </div>
                    <div class="card-body p-0" style="max-height: 400px; overflow-y: auto;">
                        @foreach($video->course->videos as $courseVideo)
                            <a href="{{ route('student.lessons.show', $courseVideo->id) }}" 
                               class="d-block p-3 border-bottom hover-lesson {{ $courseVideo->id == $video->id ? 'active-lesson' : '' }}">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="fw-semibold small">{{ Str::limit($courseVideo->title, 35) }}</span>
                                    <small class="text-muted">{{ gmdate('i:s', $courseVideo->duration_seconds ?? 0) }}</small>
                                </div>
                            </a>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function markComplete() {
    fetch('{{ route("course.watch", $video->id) }}', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => toastr.success('Dars tugallangan deb belgilandi!'))
    .catch(err => toastr.error('Xatolik!'));
}

// Avtomatik tugallash (video tugaganda)
document.getElementById('mainVideo').addEventListener('ended', function() {
    markComplete();
});
</script>

<style>
.player-card { border-radius: 24px !important; }
.hover-lesson:hover { background: #f0f9ff !important; color: #3b82f6 !important; }
.active-lesson { background: linear-gradient(135deg, #3b82f6, #1e40af) !important; color: white !important; }
.active-lesson:hover { background: linear-gradient(135deg, #2563eb, #1e40af) !important; }
.video-player-container { max-width: 1400px; margin: 0 auto; }
video::-webkit-media-controls-panel { background: linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.7)); }
</style>
@endsection