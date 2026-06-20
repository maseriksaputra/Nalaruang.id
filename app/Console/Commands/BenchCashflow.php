<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Cashflow;
use Illuminate\Support\Facades\DB;

class BenchCashflow extends Command
{
    protected $signature = 'bench:cashflow';

    public function handle()
    {
        $start = microtime(true);
        $stats = Cashflow::query()
            ->selectRaw("
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
                SUM(CASE WHEN type = 'income' AND category = 'F&B' THEN amount ELSE 0 END) as income_fnb,
                SUM(CASE WHEN type = 'income' AND category = 'ATK' THEN amount ELSE 0 END) as income_atk,
                SUM(CASE WHEN type = 'income' AND category = 'Printing' THEN amount ELSE 0 END) as income_print,
                SUM(CASE WHEN type = 'income' AND category = 'Digital' THEN amount ELSE 0 END) as income_digital,
                COUNT(*) as total_count
            ")->first();
        $timeStats = microtime(true) - $start;

        $start2 = microtime(true);
        $chart = Cashflow::query()
            ->select(
                'transaction_date as date',
                DB::raw('SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as total_income'),
                DB::raw('SUM(CASE WHEN type = "expense" THEN ABS(amount) ELSE 0 END) as total_expense')
            )
            ->groupBy('transaction_date')
            ->orderBy('transaction_date')
            ->get();
        $timeChart = microtime(true) - $start2;

        $start3 = microtime(true);
        $records = Cashflow::query()->orderBy('transaction_date', 'desc')->paginate(25);
        $timeRecords = microtime(true) - $start3;

        $this->info(json_encode([
            'time_stats_ms' => round($timeStats * 1000, 2),
            'time_chart_ms' => round($timeChart * 1000, 2),
            'time_records_ms' => round($timeRecords * 1000, 2)
        ], JSON_PRETTY_PRINT));
    }
}
