@extends('teacher.layout')

@section('title', 'Yangi Kontent Qo\'shish')
@section('page-title', $course->course_type === 'theory' ? 'Nazariya Kursiga Kontent Qo\'shish' : 'Video Qo\'shish')

@section('content')
<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h4>
            <i class="fas fa-book-open me-2"></i>
            "{{ $course->title }}" kursiga kontent qo'shish
            <span class="badge bg-purple text-white ms-2">
                {{ $course->course_type === 'theory' ? 'Nazariya' : 'Oddiy Kurs' }}
            </span>
        </h4>
        <a href="{{ route('teacher.courses') }}" class="btn btn-secondary btn-sm">
            <i class="fas fa-arrow-left me-1"></i> Orqaga
        </a>
    </div>

    <div class="card-body">
        @if(session('success'))
        <div class="alert alert-success rounded-3 mb-4" style="background:#ecfccb;color:#365314;">
            <strong>{{ session('success') }}</strong>
        </div>
        @endif

        @if(session('error'))
        <div class="alert alert-danger rounded-3 mb-4" style="background:#fee2e2;color:#991b1b;">
            <strong>{{ session('error') }}</strong>
        </div>
        @endif

        @if($errors->any())
        <div class="alert alert-danger rounded-3 mb-4">
            <ul class="mb-0">
                @foreach($errors->all() as $error)
                <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
        @endif

        <!-- Agar kurs theory bo'lsa – ikkita variant: Video yoki Quiz -->
        @if($course->course_type === 'theory')
        <div class="row mb-5">
            <div class="col-md-6">
                <div class="text-center p-4 border rounded-3 hover-shadow" style="cursor:pointer;background:#f0f9ff;border:2px solid #0ea5e9 !important;"
                    onclick="document.getElementById('video-section').style.display='block'; document.getElementById('quiz-section').style.display='none'; this.classList.add('active-card'); document.querySelector('.quiz-card').classList.remove('active-card');">
                    <i class="fas fa-video fa-3x text-info mb-3"></i>
                    <h5 class="fw-bold">Video Qo'shish</h5>
                    <p class="text-muted">Nazariy dars uchun video yuklash</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="text-center p-4 border rounded-3 hover-shadow quiz-card" style="cursor:pointer;background:#f8f0ff;border:2px solid #a855f7;"
                    onclick="document.getElementById('quiz-section').style.display='block'; document.getElementById('video-section').style.display='none'; this.classList.add('active-card'); document.querySelector('.video-card')?.classList.remove('active-card');">
                    <i class="fas fa-clipboard-check fa-3x text-purple mb-3"></i>
                    <h5 class="fw-bold">Quiz/Test Qo'shish</h5>
                    <p class="text-muted">Savollar va test yaratish</p>
                </div>
            </div>
        </div>

        <!-- Video yuklash bo'limi -->
        <div id="video-section" style="display: none;">
            @else
            <!-- Agar regular kurs bo'lsa – faqat video bo'limi ko'rinsin -->
            <div id="video-section">
                @endif

                <h5 class="mb-4"><i class="fas fa-video text-info"></i> Yangi Video Qo'shish</h5>
                <form action="{{ route('teacher.courses.videos.store', $course->id) }}" method="POST" enctype="multipart/form-data">
                    @csrf

                    <div class="form-group mb-4">
                        <label class="fw-bold"><i class="fas fa-file-video"></i> Video faylini yuklash *</label>
                        <input type="file" name="video" accept="video/*" class="form-control" required>
                        <br>
                        <small class="text-muted">Ruxsat etilgan formatlar: MP4, AVI, MOV.</small>
                    </div>

                    <div class="form-group mb-4">
                        <label class="fw-bold"><i class="fas fa-heading"></i> Video nomi *</label>
                        <input type="text" name="title" class="form-control" placeholder="Masalan: 1-dars. Kirish va asosiy tushunchalar" required>
                    </div>

                    <div class="form-group mb-4">
                        <label class="fw-bold"><i class="fas fa-align-left"></i> Tavsif (ixtiyoriy)</label>
                        <textarea name="description" class="form-control" rows="5" placeholder="Bu videoda o'quvchilar nimalarni o'rganadi?"></textarea>
                    </div>

                    <div class="form-group mb-4">
                        <label class="fw-bold"><i class="fas fa-clock"></i> Davomiyligi (daqiqa) *</label>
                        <input type="number" name="duration_minutes" class="form-control" min="1" placeholder="45" required>
                    </div>

                    <div class="text-end">
                        <a href="{{ route('teacher.courses') }}" class="btn btn-secondary me-3">Bekor qilish</a>
                        <button type="submit" class="btn btn-success px-5">
                            <i class="fas fa-upload"></i> Videoni Yuklash
                        </button>
                    </div>
                </form>
            </div>

            <!-- Quiz bo'limi (faqat theory kurslarda) -->
            @if($course->course_type === 'theory')
            <div id="quiz-section" style="display: none; margin-top: 40px;">
                <h5 class="mb-4"><i class="fas fa-clipboard-check text-purple"></i> Yangi Quiz/Test Qo'shish</h5>
                <p class="text-muted mb-4">
                    Hozircha quiz qo'shish funksiyasi alohida sahifada mavjud. Quyidagi tugma orqali o'ting:
                </p>
                <a href="{{ route('teacher.quizzes.create', $course->id) }}" class="btn btn-purple px-5">
                    <i class="fas fa-plus-circle"></i> Quiz Qo'shishga O'tish
                </a>
                <div class="mt-3">
                    <a href="{{ route('teacher.courses') }}" class="btn btn-outline-secondary">Orqaga</a>
                </div>
            </div>
            @endif
        </div>
    </div>
</div>
@endsection

@section('styles')
<style>
    .badge.bg-purple {
        background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important;
    }

    .hover-shadow {
        transition: all 0.3s;
    }

    .hover-shadow:hover {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
        transform: translateY(-5px);
    }

    .active-card {
        box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.3) !important;
        background: #f5f3ff !important;
    }

    .btn-purple {
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 12px;
        font-size: 16px;
    }

    .btn-purple:hover {
        background: linear-gradient(135deg, #7c3aed, #6d28d9);
    }

    .btn-success {
        background: linear-gradient(135deg, #10b981, #059669);
        border: none;
        border-radius: 12px;
        padding: 12px 30px;
        font-size: 16px;
    }

    .form-control {
        border: 2px solid #e2e8f0;
        border-radius: 14px;
        background: #f8fafc;
        padding: 14px 16px;
    }

    .form-control:focus {
        border-color: #8b5cf6;
        box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15);
        background: white;
    }
</style>
@endsection

@section('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const videoSection = document.getElementById('video-section');
        const quizSection = document.getElementById('quiz-section');

        // Regular va theory kurslar uchun dastlabki holat
        @if($course->course_type === 'regular')
            if (videoSection) videoSection.style.display = 'block';
            document.querySelectorAll('.hover-shadow').forEach(card => card.style.display = 'none');
        @elseif($course->course_type === 'theory')
            if (videoSection) videoSection.style.display = 'block';
            const videoCard = document.querySelector('.hover-shadow');
            if (videoCard) videoCard.classList.add('active-card');
        @endif

        @if(session('success'))
            if (videoSection) videoSection.style.display = 'block';
        @endif

        // VIDEO YUKLASH TAYYORGARLIGI (limitlarsiz)
        const videoInput = document.querySelector('input[name="video"]');
        const form = videoInput?.form;

        if (videoInput && form) {
            form.addEventListener('submit', function(e) {
                // Hech qanday client-side cheklov yo'q
            });
        }
    });
</script>
@endsection