<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Video;
use App\Repositories\VideoRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class VideoService
{
    protected $videoRepository;

    public function __construct(VideoRepository $videoRepository)
    {
        $this->videoRepository = $videoRepository;
    }

    public function uploadVideo(UploadedFile $file, array $data, Course $course): Video
    {
        $disk = 'minio';        // ← BU YERNI 'minio' ga o'zgartiring!

        $fileName = time() . '_' . preg_replace('/[^A-Za-z0-9._-]/', '_', $file->getClientOriginalName());
        $path = 'courses/' . $course->id . '/videos/' . $fileName;

        try {
            $resource = fopen($file->getRealPath(), 'r');

            $success = Storage::disk($disk)->put($path, $resource, [
                'visibility'  => null,
                'ContentType' => $file->getMimeType(),
            ]);

            if (is_resource($resource)) {
                fclose($resource);
            }

            if (!$success) {
                throw new \Exception('MinIO ga video yuklash muvaffaqiyatsiz tugadi.');
            }

            $fullUrl = Storage::disk($disk)->url($path);

            Log::info('Video muvaffaqiyatli yuklandi', [
                'disk'      => $disk,
                'course_id' => $course->id,
                'path'      => $path,
                'full_url'  => $fullUrl,
                'size_mb'   => round($file->getSize() / 1048576, 2)
            ]);

            return $this->videoRepository->create([
                'course_id'        => $course->id,
                'user_id'          => Auth::id(),
                'title'            => $data['title'] ?? $file->getClientOriginalName(),
                'description'      => $data['description'] ?? null,
                'video_url'        => $path,
                'full_url'         => $fullUrl,
                'duration_seconds' => ($data['duration_minutes'] ?? 0) * 60,
                'size'             => $file->getSize(),
            ]);
        } catch (\Throwable $e) {
            Log::error('Video upload failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new \Exception('Video yuklashda xatolik: ' . $e->getMessage());
        }
    }

    public function deleteVideo(int $id): bool
    {
        $video = $this->videoRepository->findOrFail($id);

        try {
            if (!empty($video->video_url)) {
                Storage::disk('minio')->delete($video->video_url);
            }
        } catch (\Throwable $e) {
            Log::warning('Video faylini o\'chirishda xatolik', ['video_id' => $id, 'error' => $e->getMessage()]);
        }

        return $this->videoRepository->delete($video);
    }
}
