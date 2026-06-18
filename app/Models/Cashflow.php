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
