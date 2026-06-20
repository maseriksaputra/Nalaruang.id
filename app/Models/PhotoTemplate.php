<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhotoTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'frame_image',
        'is_active',
        'cut_count',
        'price',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'price' => 'decimal:2',
    ];
}
