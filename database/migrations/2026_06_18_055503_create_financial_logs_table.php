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
        Schema::create('financial_logs', function (Blueprint $table) {
            $table->id();
            $table->string('action'); // created, updated, deleted
            $table->unsignedBigInteger('cashflow_id')->nullable();
            $table->string('description');
            $table->json('old_data')->nullable();
            $table->json('new_data')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('financial_logs');
    }
};
