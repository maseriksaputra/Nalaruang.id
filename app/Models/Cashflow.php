<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cashflow extends Model
{
    protected $fillable = [
        'service_id',
        'type',
        'amount',
        'description',
        'reference_type',
        'reference_id',
        'transaction_date',
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
