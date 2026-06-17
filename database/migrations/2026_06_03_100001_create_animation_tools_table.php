<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('animation_tools', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Contoh: "Pendulum Ayunan Daun"
            $table->string('preset_id')->unique(); // Contoh: "anim_swinging_pendulum"
            $table->enum('engine', ['gsap', 'lottie', 'css_filter']);
            $table->string('category'); // in, out, continuous, parallax
            
            // Menyimpan parameter default untuk ditawarkan ke user di builder
            $table->json('default_config')->nullable(); 
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('animation_tools');
    }
};
