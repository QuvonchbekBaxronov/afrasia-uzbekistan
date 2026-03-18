<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\StudentCourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\WatchCourseRequest;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::with(['user', 'videos'])->get();
        return view('course', compact('courses'));
    }

    public function my_course(Request $request)
    {
        $search = $request->input('search');

        $courses = Course::withCount('videos')->get();

        return view('courses.my_course', compact('courses'));
    }

    public function detail($id)
    {
        // 1. Kursni hamma darslari va o'qituvchisi bilan bazadan olamiz
        $course = Course::with(['user', 'videos'])->findOrFail($id);

        // 2. Fayling nomi 'detail.blade.php' bo'lgani uchun faqat 'detail' deb yozamiz
        return view('detail', compact('course'));
    }

    /**
     * Attempt to enter a course watching page — only for authenticated users.
     * Returns 401 JSON for AJAX guests, or redirects back with a flash error.
     */
    public function watch(WatchCourseRequest $request)
    {
        if (! Auth::check()) {
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json(['message' => 'Siz tizimga kirmagansiz. Iltimos, ro\'yxatdan o\'ting yoki tizimga kiring.'], 401);
            }

            return redirect()->back()->with('error', 'Siz tizimga kirmagansiz. Iltimos, tizimga kiring.');
        }


        $validated = $request->validated();

        $course_id = $validated['course_id'];

        StudentCourse::create([
            'course_id' => $course_id,
            'user_id' => auth()->id(),
            'enrolled_at' => now()
        ]);

        return redirect()->route('student.courses');
    }
}
