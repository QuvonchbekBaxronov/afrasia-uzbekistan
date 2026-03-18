@extends('teacher.layout')

@section('title', 'Kurslar')
@section('page-title', 'Mening Kurslarim')

@section('content')
    <div class="card">
        <div class="card-header">
            <h4>Kurslar</h4>
            <button class="btn-primary" onclick="document.getElementById('addCourseModal').style.display='flex'">
                <i class="fas fa-plus"></i> Yangi Kurs Qo'shish
            </button>
        </div>
        <div class="card-body">
            @if(session('success'))
                <div class="alert"
                    style="padding:12px 18px;border-radius:12px;background:#ecfccb;color:#365314;margin-bottom:18px;font-weight:700;">
                    {{ session('success') }}
                </div>
            @endif

            @if(session('error'))
                <div class="alert"
                    style="padding:12px 18px;border-radius:12px;background:#fee2e2;color:#991b1b;margin-bottom:18px;font-weight:700;">
                    {{ session('error') }}
                </div>
            @endif

            @if($errors->any())
                <div class="alert"
                    style="padding:12px 18px;border-radius:12px;background:#fee2e2;color:#991b1b;margin-bottom:18px;font-weight:700;">
                    <ul style="margin:0; padding-left:20px;">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @forelse($courses as $course)
                <div class="course-item" data-course-id="{{ $course->id }}">
                    <div class="course-thumbnail">
                        <img src="{{ $course->thumbnail_url }}" alt="{{ $course->title }}"
                            class="img-fluid rounded">
                        <div class="course-duration">
                            <i class="fas fa-clock"></i> {{ $course->duration_hours ?? '—' }} soat
                        </div>
                        @if($course->course_type === 'theory')
                            <div class="course-type-badge">
                                <i class="fas fa-book"></i> Nazariya
                            </div>
                        @endif
                    </div>
                    <div class="course-content">
                        <div>
                            <h5 class="course-title">{{ $course->title }}</h5>
                            <p class="course-description">{{ Str::limit($course->description ?? '', 180) }}</p>
                            <div class="course-meta">
                                <span><i class="fas fa-video"></i> {{ $course->videos->count() }} video</span>
                                <span><i class="fas fa-users"></i> {{ $course->students()->count() }} o'quvchi</span>
                                <span><i class="fas fa-star"></i> {{ $course->rating ?? '-' }}</span>
                                @if($course->quizzes)
                                    <span><i class="fas fa-clipboard-check"></i> {{ $course->quizzes->count() }} test</span>
                                @endif
                            </div>
                        </div>
                        <div class="course-actions">
                            <a href="{{ route('teacher.courses.videos.create', $course->id) }}" class="btn-sm btn-info">
                                <i class="fas fa-video"></i> Video qo'shish
                            </a>
                            <form action="{{ route('teacher.courses.destroy', $course->id) }}" method="POST"
                                style="display:inline" onsubmit="return confirm('Kursni o\'chirishni xohlaysizmi?')">
                                @csrf
                                @method('DELETE')
                                <button class="btn-sm btn-danger" type="submit">
                                    <i class="fas fa-trash"></i> O'chirish
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            @empty
                <div class="text-muted">Hozircha kurslaringiz mavjud emas.</div>
            @endforelse
        </div>
    </div>

    <!-- Yangi Kurs Qo'shish Modali -->
    <div id="addCourseModal" class="modal-overlay" style="display: none;">
        <div class="modal-content" style="max-width: 600px; width: 95%;">
            <div class="modal-header">
                <h3>Yangi Kurs Qo'shish</h3>
                <button class="modal-close" onclick="document.getElementById('addCourseModal').style.display='none'">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form action="{{ route('teacher.courses.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="form-group">
                        <label><i class="fas fa-list"></i> Kurs Turi</label>
                        <div style="display:flex;gap:15px;margin-top:10px;">
                            <label class="radio-card">
                                <input type="radio" name="course_type" value="regular" checked>
                                <div class="radio-content">
                                    <i class="fas fa-video" style="font-size:24px;color:#06b6d4;"></i>
                                    <span style="font-weight:700;margin-top:8px;">Oddiy Kurs</span>
                                    <small style="color:#64748b;">Video darslar</small>
                                </div>
                            </label>
                            <label class="radio-card">
                                <input type="radio" name="course_type" value="theory">
                                <div class="radio-content">
                                    <i class="fas fa-book" style="font-size:24px;color:#8b5cf6;"></i>
                                    <span style="font-weight:700;margin-top:8px;">Video va Nazariya</span>
                                    <small style="color:#64748b;">Quiz va testlar</small>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="img"><i class="fas fa-image"></i> Kurs rasmini yuklash</label>
                        <input type="file" id="img" name="img" accept="image/*" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="title"><i class="fas fa-heading"></i> Kurs Nomi</label>
                        <input type="text" id="title" name="title" class="form-control"
                            placeholder="Masalan: Advanced English Grammar" required>
                    </div>
                    <div class="form-group">
                        <label for="description"><i class="fas fa-align-left"></i> Kurs Izohi (Tavsifi)</label>
                        <textarea id="description" name="description" class="form-control" rows="8"
                            placeholder="Bu kursda o'quvchilar nimalarni o'rganadi? Qisqacha va jozibali yozing..."
                            required></textarea>
                    </div>
                    <div style="text-align: right; margin-top: 30px;">
                        <button type="submit" class="btn-secondary"
                            onclick="document.getElementById('addCourseModal').style.display='none'"
                            style="margin-right: 15px;">
                            Bekor qilish
                        </button>
                        <button type="submit" class="btn-primary" style="padding: 14px 32px; font-size: 16px;">
                            <i class="fas fa-save"></i> Kursni Yaratish
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <style>
        .course-type-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            color: white;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
        }

        .radio-card {
            flex: 1;
            cursor: pointer;
        }

        .radio-card input[type="radio"] {
            display: none;
        }

        .radio-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            border: 2px solid #e2e8f0;
            border-radius: 14px;
            background: #f8fafc;
            transition: all 0.3s;
        }

        .radio-card input[type="radio"]:checked+.radio-content {
            border-color: #8b5cf6;
            background: #f5f3ff;
            box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15);
        }

        .btn-quiz {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important;
            color: white;
        }

        .btn-quiz:hover {
            background: linear-gradient(135deg, #7c3aed, #6d28d9) !important;
        }

        .question-block {
            padding: 20px;
            background: #f8fafc;
            border-radius: 14px;
            margin-bottom: 20px;
            border: 2px solid #e2e8f0;
        }

        .course-item {
            display: flex;
            gap: 25px;
            padding: 25px;
            background: #f8fafc;
            border-radius: 18px;
            margin-bottom: 25px;
            border: 2px solid transparent;
            transition: all 0.3s;
        }

        .course-item:hover {
            border-color: #8b5cf6;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .course-thumbnail {
            position: relative;
            width: 300px;
            height: 180px;
            border-radius: 14px;
            overflow: hidden;
            flex-shrink: 0;
        }

        .course-thumbnail img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .course-duration {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 700;
        }

        .course-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .course-title {
            font-size: 22px;
            font-weight: 800;
            margin: 0 0 10px 0;
        }

        .course-description {
            color: #64748b;
            margin: 0 0 15px 0;
            line-height: 1.6;
        }

        .course-meta {
            display: flex;
            gap: 20px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }

        .course-meta span {
            color: #64748b;
            font-size: 14px;
        }

        .course-meta i {
            color: #8b5cf6;
            margin-right: 5px;
        }

        .course-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .btn-sm {
            padding: 10px 18px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-info {
            background: linear-gradient(135deg, #06b6d4, #0891b2);
            color: white;
        }

        .btn-danger {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
        }

        .btn-sm:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            padding: 20px;
        }

        .modal-content {
            background: white;
            border-radius: 24px;
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal-header {
            padding: 30px 35px;
            border-bottom: 2px solid #f1f5f9;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-close {
            width: 40px;
            height: 40px;
            border: none;
            background: #f1f5f9;
            border-radius: 10px;
            cursor: pointer;
            font-size: 18px;
            color: #64748b;
        }

        .modal-close:hover {
            background: #e2e8f0;
            color: #ef4444;
        }

        .modal-body {
            padding: 35px;
        }

        .form-group {
            margin-bottom: 25px;
        }

        .form-group label {
            display: block;
            margin-bottom: 10px;
            font-weight: 600;
            color: #1e293b;
            font-size: 15px;
        }

        .form-control {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 14px;
            font-size: 15px;
            background: #f8fafc;
            transition: all 0.3s;
            box-sizing: border-box;
        }

        .form-control:focus {
            outline: none;
            border-color: #8b5cf6;
            background: white;</script>
            box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15);
        }

        .btn-secondary {
            background: #e2e8f0;
            color: #475569;
            border: none;
            padding: 12px 25px;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 600;
        }

        .btn-secondary:hover {
            background: #cbd5e1;
        }

        .btn-primary {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 600;
        }

        .btn-primary:hover {
            background: linear-gradient(135deg, #7c3aed, #6d28d9);
        }
    </style>
@endsection

@section('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            let questionIndex = 1;

            // Video modal ochish
            document.querySelectorAll('.course-add-video-btn').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    const courseId = btn.getAttribute('data-id');
                    const form = document.getElementById('addVideoForm');
                    form.reset();
                    document.getElementById('video_file').value = '';
                    form.action = `/teacher/courses/${courseId}/videos`; // O'zingizning route ga moslang
                    document.getElementById('video_course_id').value = courseId;
                    document.getElementById('addVideoModal').style.display = 'flex';
                });
            });

            // Quiz modal ochish
            document.querySelectorAll('.open-quiz-modal').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    const courseId = btn.getAttribute('data-course-id');
                    document.getElementById('quiz_course_id').value = courseId;
                    document.getElementById('addQuizModal').style.display = 'flex';
                });
            });

            // Savol qo'shish
            document.getElementById('add-question-btn').addEventListener('click', function () {
                const container = document.getElementById('questions-container');
                const newBlock = document.querySelector('.question-block').cloneNode(true);

                newBlock.setAttribute('data-question-index', questionIndex);
                newBlock.querySelector('h5').innerHTML = `<i class="fas fa-question-circle"></i> Savol ${questionIndex + 1}`;

                newBlock.querySelectorAll('input, textarea, select').forEach(function (input) {
                    input.value = '';
                    const name = input.getAttribute('name');
                    if (name) {
                        input.setAttribute('name', name.replace(/\[\d+\]/, `[${questionIndex}]`));
                    }
                });

                newBlock.querySelector('.remove-question').style.display = 'inline-block';

                container.appendChild(newBlock);
                questionIndex++;

                updateRemoveButtons();
            });

            function updateRemoveButtons() {
                document.querySelectorAll('.remove-question').forEach(function (btn) {
                    btn.onclick = function () {
                        if (document.querySelectorAll('.question-block').length > 1) {
                            this.closest('.question-block').remove();
                            updateQuestionNumbers();
                        } else {
                            alert('Kamida bitta savol bo\'lishi kerak!');
                        }
                    };
                });
            }

            function updateQuestionNumbers() {
                document.querySelectorAll('.question-block').forEach(function (block, index) {
                    block.setAttribute('data-question-index', index);
                    block.querySelector('h5').innerHTML = `<i class="fas fa-question-circle"></i> Savol ${index + 1}`;

                    block.querySelectorAll('input, textarea, select').forEach(function (input) {
                        const name = input.getAttribute('name');
                        if (name) {
                            input.setAttribute('name', name.replace(/\[\d+\]/, `[${index}]`));
                        }
                    });
                });
                questionIndex = document.querySelectorAll('.question-block').length;
            }

            updateRemoveButtons();
        });
    </script>
@endsection