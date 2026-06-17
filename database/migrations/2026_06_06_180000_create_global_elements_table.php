<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('global_elements', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // 'image', 'lottie', 'shape', 'text', dll
            $table->string('category')->nullable(); // 'floral', 'ornament', 'container'
            $table->string('thumbnail_url')->nullable();
            $table->json('payload'); // Data styling, URL, dsb
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('global_elements');
    }
};
