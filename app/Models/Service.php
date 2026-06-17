<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'is_active' => 'boolean',
            'is_popular' => 'boolean',
        ];
    }

    public function packages()
    {
        return $this->hasMany(Package::class)->orderBy('sort_order');
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function templates()
    {
        return $this->hasMany(Template::class);
    }
}
