<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Template;

class RestoreViewsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:restore-views {template_id?} {views?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Kembalikan jumlah views manual';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $id = $this->argument('template_id');
        $views = $this->argument('views');
        
        if (!$id || $views === null) {
            $templates = Template::whereNotNull('invitation_id')->get();
            $this->info("--- Daftar Template Aktif ---");
            foreach($templates as $t) {
                $this->line("ID: {$t->id} | Nama: {$t->name} | Views Saat Ini: {$t->demo_views}");
            }
            $id = $this->ask('Masukkan ID Template yang ingin dikembalikan viewsnya');
            $views = $this->ask('Masukkan angka views yang seharusnya (contoh: 50)');
        }
        
        $template = Template::find($id);
        if ($template) {
            $template->demo_views = (int) $views;
            $template->save();
            $this->info("Berhasil mengubah views {$template->name} menjadi {$views}.");
            
            if ($this->confirm('Apakah Anda ingin menjalankan app:sync-views sekarang agar dasbor mengikuti angka produk ini?', true)) {
                $this->call('app:sync-views');
            }
        } else {
            $this->error('Template tidak ditemukan.');
        }
    }
}
