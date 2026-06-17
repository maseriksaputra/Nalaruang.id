<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientAsset extends Model
{
    protected $fillable = [
        'order_id',
        'field_name',
        'type',
        'content',
        'file_path',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
