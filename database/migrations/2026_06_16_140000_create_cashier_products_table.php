<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cashier_products', function (Blueprint $table) {
            $table->id();
            $table->string('category')->index(); // F&B, ATK, Printing, Digital
            $table->string('name');
            $table->decimal('default_price', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cashier_products');
    }
};
