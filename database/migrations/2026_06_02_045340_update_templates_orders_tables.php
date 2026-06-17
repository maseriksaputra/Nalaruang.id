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
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete()->after('package_id');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->integer('quantity')->default(1)->after('event_date');
            $table->json('details')->nullable()->after('custom_requests');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('templates', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['quantity', 'details']);
        });
    }
};
