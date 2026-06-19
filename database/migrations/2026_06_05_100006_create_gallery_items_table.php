<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Foto galereya jadvali migratsiyasi
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_items', function (Blueprint $table) {
            $table->id();
            $table->enum('category', ['cities', 'nature', 'food', 'culture'])->comment('Kategoriya');
            $table->json('title')->comment('Sarlavha: {uz, en, ru, it}');
            $table->string('image')->comment('Rasm yo\'li');
            $table->json('description')->nullable()->comment('Tavsifi: {uz, en, ru, it}');
            $table->foreignId('region_id')->nullable()->constrained('regions')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index('category');
            $table->index('is_active');
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_items');
    }
};
