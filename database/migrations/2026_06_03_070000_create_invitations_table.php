<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invitations', function (Blueprint $table) {
            $table->id();
            // Asumsi menggunakan tabel users untuk admin/pemilik
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            
            $table->string('title');
            $table->string('slug')->unique(); // Untuk akses url dinamis
            
            // Kolom JSON ini akan menyimpan struktur 'canvas_config'
            $table->json('canvas_config')->nullable();
            
            // Thumbnail untuk di dashboard admin
            $table->string('thumbnail_path')->nullable(); 
            
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invitations');
    }
};
