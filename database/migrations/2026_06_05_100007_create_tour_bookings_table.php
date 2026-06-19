<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tur buyurtmalari jadvali migratsiyasi
 * Hozircha "Kutilmoqda" statusi bilan
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tour_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tour_id')->constrained('tours')->cascadeOnDelete();
            $table->string('name')->comment('Buyurtmachi ismi');
            $table->string('email')->comment('Email manzili');
            $table->string('phone')->nullable()->comment('Telefon raqami');
            $table->integer('guests')->default(1)->comment('Mehmonlar soni');
            $table->date('preferred_date')->nullable()->comment('Afzal sanasi');
            $table->text('message')->nullable()->comment('Qo\'shimcha xabar');
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');
            $table->timestamps();

            $table->index('status');
            $table->index('tour_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tour_bookings');
    }
};
