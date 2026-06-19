<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Viloyatlar jadvali migratsiyasi
 *
 * O'zbekiston viloyatlari haqida ma'lumotlar saqlash uchun
 */
return new class extends Migration
{
    /**
     * Migratsiyani ishga tushirish
     */
    public function up(): void
    {
        Schema::create('regions', function (Blueprint $table) {
            $table->id();
            $table->json('name')->comment('Viloyat nomi: {uz, en, ru, it}');
            $table->string('slug')->unique();
            $table->string('population')->comment('Aholi soni');
            $table->string('area')->comment('Maydoni');
            $table->json('center')->comment('Markaz shahri: {uz, en, ru, it}');
            $table->json('description')->comment('Tavsifi: {uz, en, ru, it}');
            $table->json('famous_for')->comment('Nima bilan mashhur: {uz, en, ru, it}');
            $table->json('famous_places')->comment('Mashhur joylar ro\'yxati');
            $table->json('landmarks')->comment('Diqqatga sazovor joylar');
            $table->json('local_dishes')->comment('Mahalliy taomlar');
            $table->json('fun_facts')->comment('Qiziqarli faktlar');
            $table->string('map_image')->nullable()->comment('Xarita rasmi');
            $table->string('hero_image')->nullable()->comment('Asosiy rasm');
            $table->json('gallery')->nullable()->comment('Galereya rasmlari');
            $table->boolean('is_active')->default(true)->comment('Faollik holati');
            $table->integer('sort_order')->default(0)->comment('Saralash tartibi');
            $table->timestamps();

            $table->index('is_active');
            $table->index('sort_order');
        });
    }

    /**
     * Migratsiyani bekor qilish
     */
    public function down(): void
    {
        Schema::dropIfExists('regions');
    }
};
