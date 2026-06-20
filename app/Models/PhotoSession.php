<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhotoSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'photo_template_id',
        'customer_name',
        'final_image',
        'total_price',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
    ];

    public function template()
    {
        return $this->belongsTo(PhotoTemplate::class, 'photo_template_id');
    }
}
