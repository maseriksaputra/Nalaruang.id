<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'is_popular' => 'boolean',
        ];
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function templates()
    {
        return $this->hasMany(Template::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
