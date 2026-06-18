<?php

namespace App\Filament\Traits;

use Carbon\Carbon;

trait AppliesDashboardFilters
{
    public function applyFiltersToQuery($query, $dateColumn = 'transaction_date')
    {
        $period = $this->filters['period'] ?? 'all';
        $startDate = $this->filters['startDate'] ?? null;
        $endDate = $this->filters['endDate'] ?? null;

        if ($period && $period !== 'all') {
            switch ($period) {
                case 'today':
                    $query->whereDate($dateColumn, Carbon::today());
                    break;
                case 'yesterday':
                    $query->whereDate($dateColumn, Carbon::yesterday());
                    break;
                case 'this_week':
                    $query->whereBetween($dateColumn, [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
                    break;
                case 'last_week':
                    $query->whereBetween($dateColumn, [Carbon::now()->subWeek()->startOfWeek(), Carbon::now()->subWeek()->endOfWeek()]);
                    break;
                case 'this_month':
                    $query->whereBetween($dateColumn, [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()]);
                    break;
                case 'last_month':
                    $query->whereBetween($dateColumn, [Carbon::now()->subMonth()->startOfMonth(), Carbon::now()->subMonth()->endOfMonth()]);
                    break;
                case '30_days':
                    $query->where($dateColumn, '>=', Carbon::now()->subDays(30));
                    break;
                case 'this_year':
                    $query->whereBetween($dateColumn, [Carbon::now()->startOfYear(), Carbon::now()->endOfYear()]);
                    break;
                case 'custom':
                    if ($startDate) {
                        $query->whereDate($dateColumn, '>=', Carbon::parse($startDate));
                    }
                    if ($endDate) {
                        $query->whereDate($dateColumn, '<=', Carbon::parse($endDate));
                    }
                    break;
            }
        }

        return $query;
    }
}
