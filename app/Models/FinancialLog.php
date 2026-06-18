<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialLog extends Model
{
    protected $fillable = [
        'action',
        'cashflow_id',
        'description',
        'old_data',
        'new_data',
        'user_id',
    ];

    protected $casts = [
        'old_data' => 'array',
        'new_data' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
