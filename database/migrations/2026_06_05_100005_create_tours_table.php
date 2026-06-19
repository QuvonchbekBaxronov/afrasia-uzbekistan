<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Sayohat dasturlari jadvali migratsiyasi
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->json('name')->comment('Tur nomi: {uz, en, ru, it}');
            $table->string('slug')->unique();
            $table->integer('duration_days')->comment('Davomiyligi (kun)');
            $table->json('description')->comment('Tavsifi: {uz, en, ru, it}');
            $table->json('cities')->comment('Shaharlar ketma-ketligi');
            $table->json('itinerary')->comment('Kun bo\'yicha dastur');
            $table->json('highlights')->comment('Asosiy diqqatga sazovor joylar');
            $table->json('price_info')->nullable()->comment('Narx ma\'lumoti');
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index('is_active');
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tours');
    }
};
