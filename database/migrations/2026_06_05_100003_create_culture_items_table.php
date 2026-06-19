<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Madaniyat elementlari jadvali migratsiyasi
 *
 * Musiqa, kiyimlar va hunarmandchilik haqida ma'lumotlar
 */
return new class extends Migration
{
    /**
     * Migratsiyani ishga tushirish
     */
    public function up(): void
    {
        Schema::create('culture_items', function (Blueprint $table) {
            $table->id();
            $table->enum('category', ['music', 'clothing', 'crafts'])->comment('Kategoriya: musiqa, kiyim, hunarmandchilik');
            $table->string('subcategory')->nullable()->comment('Pastki kategoriya');
            $table->json('name')->comment('Nomi: {uz, en, ru, it}');
            $table->string('slug')->unique();
            $table->json('description')->comment('Tavsifi: {uz, en, ru, it}');
            $table->string('image')->nullable()->comment('Rasm');
            $table->boolean('is_active')->default(true)->comment('Faollik holati');
            $table->integer('sort_order')->default(0)->comment('Saralash tartibi');
            $table->timestamps();

            $table->index('category');
            $table->index('is_active');
            $table->index('sort_order');
        });
    }

    /**
     * Migratsiyani bekor qilish
     */
    public function down(): void
    {
        Schema::dropIfExists('culture_items');
    }
};
