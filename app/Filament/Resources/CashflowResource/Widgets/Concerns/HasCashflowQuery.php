<?php

namespace App\Filament\Resources\CashflowResource\Widgets\Concerns;

use App\Models\Cashflow;
use Livewire\Attributes\Reactive;

trait HasCashflowQuery
{
    #[Reactive]
    public ?array $tableFilters = null;

    #[Reactive]
    public ?array $customFilters = null;

    protected function getBaseCashflowQuery(): \Illuminate\Database\Eloquent\Builder
    {
        $query = Cashflow::query();
        $data = $this->customFilters ?? [];
        $period = $data['period'] ?? 'all';

        // Apply custom period filter logic identical to ListCashflows::getTableQuery()
        if ($period && $period !== 'all' && $period !== 'custom') {
            $now = now();
            match ($period) {
                'today' => $query->where('transaction_date', clone $now),
                'yesterday' => $query->where('transaction_date', (clone $now)->subDay()),
                'this_week' => $query->whereBetween('transaction_date', [(clone $now)->startOfWeek(), (clone $now)->endOfWeek()]),
                'last_week' => $query->whereBetween('transaction_date', [(clone $now)->subWeek()->startOfWeek(), (clone $now)->subWeek()->endOfWeek()]),
                'this_month' => $query->whereMonth('transaction_date', $now->month)->whereYear('transaction_date', $now->year),
                'last_month' => $query->whereMonth('transaction_date', (clone $now)->subMonth()->month)->whereYear('transaction_date', (clone $now)->subMonth()->year),
                '30_days' => $query->where('transaction_date', '>=', (clone $now)->subDays(30)),
                'this_year' => $query->whereYear('transaction_date', $now->year),
                default => null,
            };
        } elseif ($period === 'custom') {
            $query->when($data['startDate'] ?? null, fn ($q, $date) => $q->where('transaction_date', '>=', $date))
                  ->when($data['endDate'] ?? null, fn ($q, $date) => $q->where('transaction_date', '<=', $date));
        }

        // Apply Filament table filters manually
        if (!empty($this->tableFilters['type']['value'])) {
            $query->where('type', $this->tableFilters['type']['value']);
        }
        
        if (!empty($this->tableFilters['category']['value'])) {
            $query->where('category', $this->tableFilters['category']['value']);
        }

        return $query;
    }
}
