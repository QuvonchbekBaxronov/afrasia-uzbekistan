<?php

namespace App\Traits;

/**
 * Ko'p tilli tarjima xususiyati (Trait)
 *
 * Bu trait modellarning JSON formatidagi tarjima maydonlarini
 * osonlik bilan olish imkonini beradi.
 * Qo'llab-quvvatlanadigan tillar: uz, en, ru, it
 */
trait HasTranslations
{
    /**
     * Berilgan maydonning joriy tildagi tarjimasini olish
     *
     * @param string $field Maydon nomi
     * @param string|null $locale Til kodi (masalan: 'uz', 'en', 'ru', 'it')
     * @return string Tarjima qilingan matn
     */
    public function getTranslation(string $field, ?string $locale = null): string
    {
        $locale = $locale ?? app()->getLocale();
        $value = $this->$field;

        if (is_string($value)) {
            $value = json_decode($value, true);
        }

        if (is_array($value)) {
            return $value[$locale] ?? $value['uz'] ?? '';
        }

        return $value ?? '';
    }

    /**
     * Berilgan maydonning tarjima massivini olish
     *
     * Oddiy tarjima maydoni yoki tarjima elementlari massivi bilan ishlaydi.
     *
     * @param string $field Maydon nomi
     * @param string|null $locale Til kodi
     * @return array Tarjima massivi
     */
    public function getTranslationArray(string $field, ?string $locale = null): array
    {
        $locale = $locale ?? app()->getLocale();
        $value = $this->$field;

        if (is_string($value)) {
            $value = json_decode($value, true);
        }

        if (!is_array($value)) return [];

        // Oddiy tarjima maydoni bo'lsa: {uz: "...", en: "..."}
        if (isset($value[$locale]) && is_string($value[$locale])) {
            return $value;
        }

        // Tarjima elementlari massivi bo'lsa: [{uz: "...", en: "..."}, ...]
        return array_map(function ($item) use ($locale) {
            if (is_array($item) && isset($item[$locale])) {
                return $item[$locale];
            }
            if (is_array($item) && isset($item['uz'])) {
                return $item['uz'];
            }
            return $item;
        }, $value);
    }

    /**
     * Qisqa tarjima metodi - getTranslation() ning qisqartmasi
     *
     * @param string $field Maydon nomi
     * @param string|null $locale Til kodi
     * @return string Tarjima qilingan matn
     */
    public function t(string $field, ?string $locale = null): string
    {
        return $this->getTranslation($field, $locale);
    }

    /**
     * Qisqa massiv tarjima metodi - getTranslationArray() ning qisqartmasi
     *
     * @param string $field Maydon nomi
     * @param string|null $locale Til kodi
     * @return array Tarjima massivi
     */
    public function tArray(string $field, ?string $locale = null): array
    {
        return $this->getTranslationArray($field, $locale);
    }
}
