<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Kontakt xabarlari jadvali migratsiyasi
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Yuboruvchi ismi');
            $table->string('email')->comment('Email manzili');
            $table->string('phone')->nullable()->comment('Telefon raqami');
            $table->string('subject')->comment('Mavzu');
            $table->text('message')->comment('Xabar matni');
            $table->boolean('is_read')->default(false)->comment('O\'qilganmi');
            $table->timestamps();

            $table->index('is_read');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
    }
};
