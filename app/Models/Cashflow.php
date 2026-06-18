<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cashflow extends Model
{
    use HasFactory;

    protected static function booted()
    {
        static::saved(function ($cashflow) {
            \Illuminate\Support\Facades\Cache::forget('last_bep_sync_time');
        });
        
        static::deleted(function ($cashflow) {
            \Illuminate\Support\Facades\Cache::forget('last_bep_sync_time');
            
            FinancialLog::create([
                'action' => 'deleted',
                'cashflow_id' => $cashflow->id,
                'description' => "Menghapus transaksi: {$cashflow->description}",
                'old_data' => $cashflow->getOriginal(),
                'new_data' => null,
                'user_id' => auth()->id(),
            ]);
        });

        static::created(function ($cashflow) {
            FinancialLog::create([
                'action' => 'created',
                'cashflow_id' => $cashflow->id,
                'description' => "Menambahkan transaksi baru: {$cashflow->description}",
                'old_data' => null,
                'new_data' => $cashflow->getAttributes(),
                'user_id' => auth()->id(),
            ]);
        });

        static::updated(function ($cashflow) {
            FinancialLog::create([
                'action' => 'updated',
                'cashflow_id' => $cashflow->id,
                'description' => "Mengubah transaksi: {$cashflow->description}",
                'old_data' => $cashflow->getOriginal(),
                'new_data' => $cashflow->getChanges(),
                'user_id' => auth()->id(),
            ]);
        });
    }

    protected $fillable = [
        'service_id',
        'type',
        'amount',
        'description',
        'reference_type',
        'reference_id',
        'transaction_date',
        'category',
    ];

    protected $casts = [
        'transaction_date' => 'date',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    protected static function boot()
    {
        parent::boot();
        static::saving(function ($cashflow) {
            if ($cashflow->type === 'expense') {
                $cashflow->amount = -abs($cashflow->amount);
            } else {
                $cashflow->amount = abs($cashflow->amount);
            }
        });
    }
}
