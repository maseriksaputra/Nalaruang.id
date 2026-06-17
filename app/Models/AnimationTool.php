<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;

class AnimationTool extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'default_config' => AsArrayObject::class,
        'is_active' => 'boolean',
    ];
}
