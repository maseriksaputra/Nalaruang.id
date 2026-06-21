<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class FixBuilderDb extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'builder:fix-db';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix missing columns in builder tables without running full migrations.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking global_elements table...');

        if (Schema::hasTable('global_elements')) {
            if (!Schema::hasColumn('global_elements', 'user_id')) {
                $this->info('Adding missing user_id column to global_elements table...');
                Schema::table('global_elements', function (Blueprint $table) {
                    $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade')->after('id');
                });
                $this->info('Column user_id added successfully.');
            } else {
                $this->info('Column user_id already exists in global_elements table.');
            }
        } else {
            $this->error('Table global_elements does not exist.');
        }

        $this->info('Database fix completed!');
    }
}
