<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Cashflow;
use App\Models\Service;

class FixCashflows extends Command
{
    protected $signature = 'app:fix-cashflows';
    protected $description = 'Fix missing categories in cashflows';

    public function handle()
    {
        $this->info('Starting to fix cashflow categories...');
        $cashflows = Cashflow::whereNull('category')->get();
        $count = 0;

        foreach ($cashflows as $cf) {
            if ($cf->service_id) {
                $service = Service::find($cf->service_id);
                if ($service) {
                    $category = match ($service->slug) {
                        'event-digital' => 'Digital',
                        'cetak-fisik-premium' => 'Printing',
                        'souvenir-merchandise' => 'Souvenir',
                        default => 'Digital',
                    };
                    $cf->category = $category;
                    $cf->save();
                    $count++;
                    $this->line("Updated Cashflow ID {$cf->id} to {$category}");
                }
            } elseif (strpos($cf->description, 'Pesanan Baru') !== false) {
                $cf->category = 'Digital'; // Default fallback
                $cf->save();
                $count++;
                $this->line("Updated Cashflow ID {$cf->id} to fallback Digital");
            }
        }

        $this->info("Finished! Fixed {$count} cashflows.");
    }
}
