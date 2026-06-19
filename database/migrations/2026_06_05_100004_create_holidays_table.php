<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bayramlar jadvali migratsiyasi
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('holidays', function (Blueprint $table) {
            $table->id();
            $table->json('name')->comment('Bayram nomi: {uz, en, ru, it}');
            $table->string('slug')->unique();
            $table->json('date_info')->comment('Sana ma\'lumoti: {uz, en, ru, it}');
            $table->json('description')->comment('Tavsifi: {uz, en, ru, it}');
            $table->json('traditions')->nullable()->comment('An\'analari: {uz, en, ru, it}');
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
        Schema::dropIfExists('holidays');
    }
};
