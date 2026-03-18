<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ImageService
{
    public function uploadImage(UploadedFile $file, string $folder = 'avatars'): string
    {
        $disk = 'minio';

        $fileName = time() . '_' . preg_replace('/[^A-Za-z0-9._-]/', '_', $file->getClientOriginalName());
        $path = trim($folder, '/') . '/' . $fileName;

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
                throw new \Exception('MinIO ga yuklash muvaffaqiyatsiz');
            }

            $fullUrl = Storage::disk($disk)->url($path);

            Log::info('Image uploaded to MinIO', [
                'path'     => $path,
                'full_url' => $fullUrl,
                'size'     => $file->getSize()
            ]);

            return $fullUrl;   // To'liq URL qaytaramiz

        } catch (\Throwable $e) {
            Log::error('ImageService Error', [
                'message' => $e->getMessage(),
                'file'    => $file->getClientOriginalName()
            ]);
            throw $e;
        }
    }
}