<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    /**
     * Relasi kembali ke Undangan (Inverse)
     */
    public function invitation()
    {
        return $this->belongsTo(Invitation::class);
    }
}
