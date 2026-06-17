<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GlobalElement extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'category',
        'thumbnail_url',
        'payload'
    ];

    protected $casts = [
        'payload' => 'array',
    ];
}
