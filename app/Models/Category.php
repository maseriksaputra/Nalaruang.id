<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'name',
        'slug',
        'description',
        'image',
        'form_type',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function templates()
    {
        return $this->hasMany(Template::class);
    }
}
