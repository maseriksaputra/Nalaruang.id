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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('form_token')->nullable()->unique();
            $table->timestamp('form_expires_at')->nullable();
            $table->string('form_status')->default('pending'); // pending, submitted
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['form_token', 'form_expires_at', 'form_status']);
        });
    }
};
