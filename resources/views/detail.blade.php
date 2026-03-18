@extends('layouts.app')
@section('content')
    <style>
        /* Scrollbar stilini o'zgartirish */
        .mavzular-scroll::-webkit-scrollbar {
            width: 4px;
        }

        .mavzular-scroll::-webkit-scrollbar-track {
            background: transparent;
        }

        .mavzular-scroll::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
        }

        .back-button-container {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 10;
        }
    </style>
    <div class="container-fluid py-5" style="position: relative;">
        <div class="back-button-container">
            <a href="{{ route('courses') }}" class="btn btn-outline-primary" style="border-radius: 50px; padding: 10px 20px;">
                <i class="fa fa-arrow-left mr-1"></i> Orqaga
            </a>
        </div>

        <div class="container py-5">
            <div class="text-center mb-5">
                <h1 class="display-5 mb-0">{{ $course->title }}</h1>
            </div>
            <div class="row mb-4">
                <div class="col-lg-6 col-md-12 mb-4">
                    <div class="position-relative" style="border-radius: 10px; overflow: hidden; height: 100%;">
                          @php
                            $courseImageUrl = $course->thumbnail_url;
                        @endphp

                        <img class="img-fluid course-img"
                                 src="{{ $courseImageUrl }}"
                                 alt="{{ $course->title }}"
                                 loading="lazy"
                                 style="height: 100%; width: 100%; object-fit: cover; position: absolute; top: 0; left: 0; z-index: 1;
                                        filter: brightness(1.2) contrast(1.15) saturate(1.1);">

                        <div class="position-absolute" style="bottom: 20px; left: 20px;">
                            <button class="btn btn-primary btn-lg">
                                <i class="fa fa-play-circle"></i> Video ko'rish
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-12 mb-4">
                    <div class="bg-light p-4" style="border-radius: 10px; height: 400px;">
                        <h3 class="mb-4">Mavzular</h3>
                        <ul class="list-group list-group-flush mavzular-scroll"
                            style="max-height: 320px; overflow-y: auto;">
                            @forelse($course->videos as $index => $video)
                                <li
                                    class="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                                    <a href="#" class="text-decoration-none h6 m-0">{{ $video->title }}</a>
                                    <span class="badge badge-primary badge-pill">{{ $index + 1 }}-dars</span>
                                </li>
                            @empty
                                <li class="list-group-item bg-transparent">Hozircha darslar yuklanmagan.</li>
                            @endforelse
                        </ul>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-8 col-md-12 mb-4">
                    <div class="bg-light p-4" style="border-radius: 10px;">
                        <h3 class="mb-4">Kurs haqida</h3>
                        <div class="course-description">
                            {!! nl2br(e($course->description)) !!}
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-12 mb-4">
                    <div
                        style="background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;">
                        <h4 class="text-primary py-3 px-4 m-0"
                            style="background: #f8f9fa; border-bottom: 1px solid #e0e0e0;">Xususiyatlar</h4>

                        <div class="d-flex justify-content-between border-bottom px-4">
                            <h6 class="my-3">O'qituvchi</h6>
                            <h6 class="my-3 font-weight-bold">{{ $course->user->name ?? 'Admin' }}</h6>
                        </div>

                        <div class="d-flex justify-content-between border-bottom px-4">
                            <h6 class="my-3">Darslar soni</h6>
                            <h6 class="my-3 font-weight-bold">{{ $course->videos->count() }} ta</h6>
                        </div>

                        <div class="d-flex justify-content-between border-bottom px-4">
                            <h6 class="my-3">Tili</h6>
                            <h6 class="my-3 font-weight-bold">O'zbek</h6>
                        </div>

                        <h5 class="text-success py-3 px-4 m-0">Kurs narxi: Bepul</h5>

                        <div class="py-3 px-4">
                            <form action="{{ route('course.watch') }}" method="POST">
                                @csrf
                                <input type="hidden" name="course_id" value="{{ $course->id }}">
                                <button type="submit" class="btn btn-block btn-primary py-3">Hozir ko'rish</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
