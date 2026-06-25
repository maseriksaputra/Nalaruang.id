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
        Schema::table('invitation_visitors', function (Blueprint $table) {
            $table->unsignedBigInteger('invitation_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invitation_visitors', function (Blueprint $table) {
            $table->unsignedBigInteger('invitation_id')->nullable(false)->change();
        });
    }
};
