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
        Schema::table('templates', function (Blueprint $table) {
            $table->unsignedBigInteger('invitation_id')->nullable()->after('id');
            // Assuming invitation_id connects to invitations table.
            // We use simple unsignedBigInteger instead of foreignId to avoid complex constraint issues if invitations don't exist yet or are managed differently.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('templates', function (Blueprint $table) {
            $table->dropColumn('invitation_id');
        });
    }
};
