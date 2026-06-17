<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('invitation_id')->nullable()->after('template_id');
            // If you want a foreign key, you could add:
            // $table->foreign('invitation_id')->references('id')->on('invitations')->nullOnDelete();
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('invitation_id');
        });
    }
};
