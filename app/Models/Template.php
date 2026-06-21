<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    use HasFactory;

    protected $fillable = [
        'invitation_id',
        'service_id',
        'category_id',
        'package_id',
        'name',
        'image',
        'images',
        'image_aspect_ratio',
        'price',
        'discount_price',
        'category',
        'preview_url',
        'demo_views',
        'total_invitation_views',
        'is_active',
        'stok',
        'sort_order',
        'form_schema',
        'description',
        'specifications',
    ];

    protected $casts = [
        'images' => 'array',
        'form_schema' => 'array',
        'specifications' => 'array',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function serviceCategory()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    protected static function booted()
    {
        static::saved(function ($template) {
            if ($template->invitation_id && $template->wasChanged('name')) {
                $invitation = \App\Models\Invitation::find($template->invitation_id);
                if ($invitation && $invitation->title !== $template->name) {
                    $invitation->title = $template->name;
                    $invitation->save();
                }
            }
        });
    }
}
