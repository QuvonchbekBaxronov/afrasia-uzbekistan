<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Tilni o'rnatish middleware
 *
 * URL parametri yoki sessiyadan tilni aniqlaydi va ilovaga o'rnatadi.
 * Qo'llab-quvvatlanadigan tillar: uz, en, ru, it
 * Standart til: uz
 */
class SetLocale
{
    /**
     * Qo'llab-quvvatlanadigan tillar ro'yxati
     */
    protected array $supportedLocales = ['uz', 'en', 'ru', 'it'];

    /**
     * So'rovni qayta ishlash
     *
     * @param Request $request Kiruvchi so'rov
     * @param Closure $next Keyingi middleware
     * @return Response Javob
     */
    public function handle(Request $request, Closure $next): Response
    {
        // URL query parametridan tilni tekshirish
        $locale = $request->query('locale');

        // Agar URL da til bo'lmasa, sessiyadan olish
        if (!$locale) {
            $locale = $request->session()->get('locale');
        }

        // Tilni tekshirish va o'rnatish
        if ($locale && in_array($locale, $this->supportedLocales)) {
            app()->setLocale($locale);
            $request->session()->put('locale', $locale);
        } else {
            // Standart tilni o'rnatish
            $defaultLocale = config('languages.default', 'uz');
            app()->setLocale($defaultLocale);
            $request->session()->put('locale', $defaultLocale);
        }

        return $next($request);
    }
}
