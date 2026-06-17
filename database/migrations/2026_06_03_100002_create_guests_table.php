<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invitation_id')->constrained()->cascadeOnDelete();
            
            $table->string('name');
            $table->string('whatsapp_number')->nullable();
            
            // Digunakan untuk URL: domain.com/romeo-juliet?to=budi-dan-keluarga
            $table->string('url_parameter')->index(); 
            
            $table->enum('rsvp_status', ['pending', 'attending', 'declined'])->default('pending');
            $table->integer('pax')->default(0); // Jumlah orang yang dibawa
            
            $table->enum('wa_blast_status', ['pending', 'queued', 'sent', 'failed'])->default('pending');
            
            // Berguna jika ada pesan ucapan dari tamu
            $table->text('greeting_message')->nullable(); 
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};
