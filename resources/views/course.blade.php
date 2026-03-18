@extends('layouts.app')

@section('content')
<style>
/* Kurs kartochka hover effektlari */
.courses-list-item {
    transition: all 0.4s ease !important;
    overflow: hidden !important;
}
.courses-list-item:hover {
    transform: translateY(-10px) !important;
    box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
}
.courses-list-item:hover .course-img {
    transform: scale(1.05) !important;
    filter: brightness(1.15) contrast(1.15) saturate(1.2) !important;
}
.courses-list-item:hover .courses-text {
    background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.1) 80%) !important;
}
.course-img {
    transition: all 0.4s ease !important;
}
</style>

<div class="jumbotron jumbotron-fluid page-header position-relative overlay-bottom" style="margin-bottom: 90px;">
    <div class="container text-center py-5">
        <h2 class="text-white display-1">Kurslar</h2>
        <div class="d-inline-flex text-white mb-5">
            <p class="m-0 text-uppercase">Barcha</p>
            <i class="fa fa-angle-double-left pt-1 px-1"></i>
            <i class="fa fa-angle-double-right pt-1 px-1"></i>
            <p class="m-0 text-uppercase">Kurslar</p>
        </div>
    </div>
</div>

<!-- Ta'lim nazariyasi kursi -->
<div class="container-fluid py-5 bg-light mb-5">
    <div class="container py-5">
        <div class="row mx-0 justify-content-center">
            <div class="col-lg-8">
                <div class="section-title text-center position-relative mb-5">
                    <h1 class="display-5">Ta'lim nazariyasi kursi</h1>
                </div>
            </div>
        </div>

        @foreach ($courses as $course)
            @if ($course->course_type === 'theory')
@php
    $courseImageUrl = $course->thumbnail_url;
@endphp

                <div class="row align-items-center mb-5">
                    <!-- Kurs rasmi kartochka -->
                    <div class="col-lg-4 col-md-6 pb-4">
                        <a class="courses-list-item position-relative d-block overflow-hidden shadow course-card"
                           href="{{ route('course.detail', $course->id) }}"
                           style="border-radius: 20px; text-decoration: none; display: block; height: 450px;">

                            <img class="img-fluid course-img"
                                 src="{{ $courseImageUrl }}"
                                 alt="{{ $course->title }}"
                                 loading="lazy"
                                 style="height: 100%; width: 100%; object-fit: cover; position: absolute; top: 0; left: 0; z-index: 1;
                                        filter: brightness(1.2) contrast(1.15) saturate(1.1);">

                            <!-- Gradient overlay - SHAFFOF va chiroyli -->
                            <div class="courses-text"
                                 style="position: absolute; bottom: 0; left: 0; width: 100%; z-index: 2;
                                        background: linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.1) 80%);
                                        padding: 30px 25px 25px; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px;">
                                <div class="text-center mb-3">
                                    <h4 class="text-white m-0" style="font-weight: 700; font-size: 24px; line-height: 1.3;">
                                        {{ $course->title }}
                                    </h4>
                                    <p class="text-white-50 mb-1 mt-2" style="font-size: 15px; opacity: 0.9;">
                                        O'qituvchi: {{ $course->user->name ?? "O'qituvchi" }}
                                    </p>
                                </div>
                                <div style="width: 100%; height: 1px; background: rgba(255,255,255,0.3); margin-bottom: 18px;"></div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div style="color: #ffc107; font-weight: 800; font-size: 18px;">
                                        {{ $course->videos_count }} ta dars
                                    </div>
                                    <span style="background: linear-gradient(45deg, #ff8a50, #ff6b35); color: white; padding: 8px 16px; 
                                                 border-radius: 25px; font-size: 13px; font-weight: 700; box-shadow: 0 4px 15px rgba(255,138,80,0.4);">
                                        Video kurs
                                    </span>
                                </div>
                            </div>
                        </a>
                    </div>

                    <!-- Kurs tavsifi -->
                    <div class="col-lg-8 col-md-6 pb-4">
                        <a href="{{ route('course.detail', $course->id) }}" style="text-decoration: none; color: inherit;">
                            <div class="p-5 bg-white shadow-lg hover-shadow"
                                 style="border-radius: 20px; min-height: 450px; display: flex; flex-direction: column; 
                                        border: 1px solid rgba(0,0,0,0.05); transition: all 0.3s ease;">
                                <h4 class="text-primary border-bottom pb-3 mb-4" style="font-weight: 700; font-size: 22px; border-color: rgba(99,102,241,0.2) !important;">
                                    Kurs haqida
                                </h4>
                                <p style="font-size: 18px; color: #444; line-height: 1.7; flex-grow: 1; white-space: pre-line;">
                                    {{ Str::limit($course->description, 600) }}
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            @endif
        @endforeach
    </div>
</div>

<!-- Boshqa kurslar -->
<div class="container-fluid py-5">
    <div class="container py-5">
        <div class="row mx-0 justify-content-center">
            <div class="col-lg-8">
                <div class="section-title text-center position-relative mb-5">
                    <h1 class="display-5">Boshqa kurslarimiz</h1>
                </div>
            </div>
        </div>

        <div class="row">
            @foreach ($courses->sortByDesc('created_at') as $course)
                @if ($course->course_type !== 'theory')
                    @php
                        $courseImageUrl = $course->thumbnail_url;
                    @endphp

                    <div class="col-lg-4 col-md-6 pb-5">
                        <a class="courses-list-item position-relative d-block overflow-hidden shadow course-card mb-4"
                           href="{{ route('course.detail', $course->id) }}"
                           style="border-radius: 20px; text-decoration: none; display: block; height: 450px;">

                            <img class="img-fluid course-img"
                                 src="{{ $courseImageUrl }}"
                                 alt="{{ $course->title }}"
                                 loading="lazy"
                                 style="height: 100%; width: 100%; object-fit: cover; position: absolute; top: 0; left: 0; z-index: 1;
                                        filter: brightness(1.2) contrast(1.15) saturate(1.1);">

                            <div class="courses-text"
                                 style="position: absolute; bottom: 0; left: 0; width: 100%; z-index: 2;
                                        background: linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.1) 80%);
                                        padding: 30px 25px 25px; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px;">
                                <div class="text-center mb-3">
                                    <p class="text-white mb-2" style="font-size: 15px; opacity: 0.9;">
                                        O'qituvchi: {{ $course->user->name ?? "O'qituvchi" }}
                                    </p>
                                    <h4 class="text-white m-0" style="font-weight: 700; font-size: 23px; line-height: 1.3;">
                                        {{ $course->title }}
                                    </h4>
                                </div>
                                <div style="width: 100%; height: 1px; background: rgba(255,255,255,0.3); margin-bottom: 18px;"></div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div style="color: #ffc107; font-weight: 800; font-size: 18px;">
                                        {{ $course->videos_count }} ta dars
                                    </div>
                                    <span style="background: linear-gradient(45deg, #ff8a50, #ff6b35); color: white; padding: 10px 18px; 
                                                 border-radius: 25px; font-size: 13px; font-weight: 700; box-shadow: 0 4px 15px rgba(255,138,80,0.4);">
                                        Video kurs
                                    </span>
                                </div>
                            </div>
                        </a>
                    </div>
                @endif
            @endforeach
        </div>
    </div>
</div>
@endsection