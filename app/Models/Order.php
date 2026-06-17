<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'template_id',
        'package_id',
        'customer_name',
        'customer_phone',
        'event_date',
        'quantity',
        'guest_list',
        'custom_requests',
        'details',
        'status',
        'total_price',
        'form_token',
        'form_expires_at',
        'form_status',
    ];

    protected $casts = [
        'event_date' => 'date',
        'details' => 'array',
        'form_expires_at' => 'datetime',
    ];

    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function clientAssets()
    {
        return $this->hasMany(ClientAsset::class);
    }

    protected static function booted()
    {
        static::creating(function ($order) {
            // Token generation moved to manual action in SaaS portal
        });
    }
}
