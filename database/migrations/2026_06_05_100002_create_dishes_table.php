<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Taomlar jadvali migratsiyasi
 *
 * O'zbek milliy taomlari haqida ma'lumotlar saqlash uchun
 */
return new class extends Migration
{
    /**
     * Migratsiyani ishga tushirish
     */
    public function up(): void
    {
        Schema::create('dishes', function (Blueprint $table) {
            $table->id();
            $table->json('name')->comment('Taom nomi: {uz, en, ru, it}');
            $table->string('slug')->unique();
            $table->json('description')->comment('Tavsifi: {uz, en, ru, it}');
            $table->json('region')->comment('Viloyat ma\'lumoti: {uz, en, ru, it}');
            $table->string('image')->nullable()->comment('Taom rasmi');
            $table->json('ingredients')->nullable()->comment('Tarkibiy qismlar');
            $table->json('recipe')->nullable()->comment('Tayyorlash tartibi: {uz, en, ru, it}');
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
        Schema::dropIfExists('dishes');
    }
};
