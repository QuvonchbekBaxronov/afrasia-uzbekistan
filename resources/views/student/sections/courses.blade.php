@extends('student.layout')

@section('title', 'Mening Kurslarim')
@section('page-title', 'Mening Kurslarim')

@section('content')
<div class="row">
    @forelse ($enrolledCourses as $course)
        <div class="col-lg-4 col-md-6 mb-4">
            <a href="{{ route('student.courses.show', $course->id) }}" class="course-link text-decoration-none">
                <div class="course-item bg-white rounded-3 overflow-hidden shadow-sm h-100 d-flex flex-column">

                    <!-- Darslar ro'yxati (birinchi 5 ta) -->
                    <div class="p-3 bg-light border-bottom">
                        <h6 class="mb-2 fw-bold">Kurs darslari ({{ $course->videos_count }} ta)</h6>
                        <ul class="list-unstyled mb-0 small">
                            @foreach($course->videos->take(5) as $video)
                                <li class="d-flex justify-content-between align-items-center mb-1">
                                    <span>{{ Str::limit($video->title ?? 'Dars ' . $video->id, 30) }}</span>

                                    <!-- Yangi tabda + modalda ochilishi uchun <a> ishlatamiz -->
                                    <a href="{{ $video->resolved_url }}"
                                       target="_blank"
                                       class="btn btn-sm btn-outline-primary py-0 px-2 text-decoration-none"
                                       data-bs-toggle="modal"
                                       data-bs-target="#videoPreviewModal"
                                       data-video-url="{{ $video->resolved_url }}"
                                       data-video-title="{{ $video->title ?? 'Dars ' . $video->id }}">
                                        <i class="fas fa-play"></i> Ko'rish
                                    </a>
                                </li>
                            @endforeach

                            @if($course->videos_count > 5)
                                <li class="text-muted small">... va yana {{ $course->videos_count - 5 }} ta</li>
                            @endif
                        </ul>
                    </div>

                    <!-- Thumbnail -->
                    <div class="course-thumbnail position-relative">
                        @php
                            $imageUrl = $course->thumbnail_url;
                        @endphp
                        <img src="{{ $imageUrl }}" alt="{{ $course->title }}" class="w-100" style="height: 200px; object-fit: cover;">
                        <div class="course-duration position-absolute bottom-0 end-0 bg-dark bg-opacity-75 text-white px-3 py-1 rounded-start">
                            <i class="fas fa-clock"></i> {{ $course->duration_hours ?? 'Noma\'lum' }} soat
                        </div>
                    </div>

                    <div class="p-4 flex-grow-1 d-flex flex-column">
                        <h5 class="fw-bold mb-2" style="font-size: 19px; color: #1e293b;">
                            {{ Str::limit($course->title, 50) }}
                        </h5>
                        <p class="text-muted mb-3">
                            <i class="fas fa-chalkboard-teacher text-primary"></i>
                            O'qituvchi: {{ $course->user->name ?? 'O\'qituvchi' }}
                        </p>

                        <div class="d-flex justify-content-between text-muted small mb-3">
                            <span><i class="fas fa-video text-primary"></i> {{ $course->videos_count }} ta dars</span>
                            <span><i class="fas fa-star text-warning"></i> 4.9</span>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    @empty
        <div class="col-12 text-center py-5">
            <i class="fas fa-book-open fa-4x text-muted mb-4"></i>
            <h4 class="text-muted">Hozircha hech qanday kursga ro'yxatdan o'tmagansiz</h4>
            <a href="{{ route('courses') }}" class="btn btn-primary mt-3">Kurslarni ko'rish</a>
        </div>
    @endforelse
</div>

<!-- Umumiy modal (barcha previewlar uchun) -->
<div class="modal fade" id="videoPreviewModal" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="videoPreviewModalTitle">Dars</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-0">
                <video id="previewVideoPlayer" class="w-100" style="height: 70vh;" controls autoplay>
                    <source src="#" type="video/mp4">
                    Brauzeringiz video qo'llab-quvvatlamaydi.
                </video>
            </div>
        </div>
    </div>
</div>

<script>
    const modal = document.getElementById('videoPreviewModal');
    modal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        const url = button.getAttribute('data-video-url');
        const title = button.getAttribute('data-video-title');

        document.getElementById('videoPreviewModalTitle').textContent = title;
        const video = document.getElementById('previewVideoPlayer');
        video.querySelector('source').src = url;
        video.load();
    });

    modal.addEventListener('hidden.bs.modal', function () {
        const video = document.getElementById('previewVideoPlayer');
        video.pause();
        video.querySelector('source').src = '#';
        video.load();
    });
</script>

<style>
    .course-link { display: block; color: inherit; text-decoration: none; transition: transform 0.3s ease; }
    .course-link:hover { transform: translateY(-8px); }
    .course-link:hover .course-item { box-shadow: 0 15px 35px rgba(0,0,0,0.15) !important; }
    .progress { background-color: #e2e8f0; }
</style>
@endsection