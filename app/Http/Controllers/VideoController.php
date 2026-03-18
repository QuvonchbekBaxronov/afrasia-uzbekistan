<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\Services\VideoService;

class VideoController extends Controller
{
    protected $videoService;

    public function __construct(VideoService $videoService)
    {
        $this->videoService = $videoService;
    }

    /**
     * Video yuklash formasi (agar kerak bo'lsa)
     */
    public function create($courseId)
    {
        $course = Auth::user()->courses()->findOrFail($courseId);
        return view('teacher.videos.create', compact('course'));
    }

    /**
     * Yangi video yuklash
     */
    public function store(Request $request, $courseId)
    {
        $course = Auth::user()->courses()->findOrFail($courseId);

        // 1️⃣ Validatsiya (PHP limitini tekshirish)
        $maxUploadSize = min(
            $this->parseSize(ini_get('upload_max_filesize')),
            $this->parseSize(ini_get('post_max_size')),
            1024 * 1024 * 1024 // 1 GB
        );

        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'description'      => 'nullable|string',
            'duration_minutes' => 'required|integer|min:1',
            'video'            => [
                'required',
                'file',
                'mimes:mp4,avi,mov,webm,mpg,mpeg',
                'max:' . ($maxUploadSize / 1024), // KB ga aylantirish
            ],
        ], [
            'video.max' => 'Video hajmi ' . $this->formatBytes($maxUploadSize) . ' dan oshmasligi kerak!'
        ]);

        $file = $request->file('video');

        if (!$file || !$file->isValid()) {
            return back()->with('error', 'Video fayl yuklanmadi yoki buzilgan.');
        }

        try {
            $this->videoService->uploadVideo($file, $validated, $course);

            return back()->with('success', 'Video muvaffaqiyatli yuklandi!');
        } catch (\Throwable $e) {
            Log::error('Video yuklash xatosi', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Xatolik: ' . $e->getMessage());
        }
    }

    private function parseSize($size)
    {
        $unit = strtoupper(substr($size, -1));
        $value = (int) substr($size, 0, -1);

        switch ($unit) {
            case 'G':
                return $value * 1024 * 1024 * 1024;
            case 'M':
                return $value * 1024 * 1024;
            case 'K':
                return $value * 1024;
            default:
                return (int) $size;
        }
    }

    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }

    /**
     * Video o'chirish
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $video = Video::findOrFail($id);

        if ($video->course->user_id !== $user->id) {
            if (request()->ajax()) {
                return response()->json(['success' => false, 'message' => 'Ruxsat yo\'q'], 403);
            }
            abort(403);
        }

        try {
            $this->videoService->deleteVideo($id);
        } catch (\Throwable $e) {
            Log::error('Video o\'chirish xatosi: ' . $e->getMessage());
        }

        if (request()->ajax()) {
            return response()->json(['success' => true, 'message' => 'Video o\'chirildi']);
        }

    }
}
