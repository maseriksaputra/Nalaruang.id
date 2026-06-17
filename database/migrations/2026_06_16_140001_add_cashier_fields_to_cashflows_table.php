<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cashflows', function (Blueprint $table) {
            $table->integer('quantity')->default(1)->after('type');
            $table->decimal('price', 15, 2)->default(0)->after('quantity');
            $table->string('category')->nullable()->after('description'); // F&B, ATK, dll
        });
    }

    public function down(): void
    {
        Schema::table('cashflows', function (Blueprint $table) {
            $table->dropColumn(['quantity', 'price', 'category']);
        });
    }
};
