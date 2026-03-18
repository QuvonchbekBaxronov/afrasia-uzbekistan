<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPostMaxSize
{
    /**
     * PHP post_max_size oshib ketganda $_POST bo'sh bo'ladi va
     * Laravel hech qanday xato ko'rsatmaydi. Shu muammoni ushlaymiz.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethod('POST') || $request->isMethod('PUT') || $request->isMethod('PATCH')) {
            $serverContentLength = (int) ($request->server('CONTENT_LENGTH') ?? 0);
            $postMaxSize = $this->parseSize(ini_get('post_max_size'));

            if ($postMaxSize > 0 && $serverContentLength > $postMaxSize) {
                return back()
                    ->withInput()
                    ->with('error', 'Yuklangan fayl hajmi juda katta. Maksimal ruxsat: ' . $this->formatBytes($postMaxSize));
            }
        }

        return $next($request);
    }

    private function parseSize(string $size): int
    {
        $unit = strtoupper(substr($size, -1));
        $value = (int) substr($size, 0, -1);

        return match ($unit) {
            'G' => $value * 1024 * 1024 * 1024,
            'M' => $value * 1024 * 1024,
            'K' => $value * 1024,
            default => (int) $size,
        };
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes >= 1024 * 1024 * 1024) {
            return round($bytes / (1024 * 1024 * 1024), 1) . ' GB';
        }
        if ($bytes >= 1024 * 1024) {
            return round($bytes / (1024 * 1024), 0) . ' MB';
        }
        return round($bytes / 1024, 0) . ' KB';
    }
}
