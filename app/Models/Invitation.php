<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;

class Invitation extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['id'];

    /**
     * Attribute Casting
     * 'AsArrayObject' akan mengonversi kolom JSON menjadi ArrayObject secara instan.
     */
    protected $casts = [
        'canvas_config' => AsArrayObject::class, 
    ];

    /**
     * Relasi ke User (Tenant/Admin)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Tamu (One-to-Many)
     */
    public function guests()
    {
        return $this->hasMany(Guest::class);
    }

    /**
     * Relasi ke GuestLink (Tamu untuk dibagikan link)
     */
    public function guestLinks()
    {
        return $this->hasMany(GuestLink::class);
    }

    /**
     * Relasi ke RSVP (One-to-Many)
     */
    public function rsvps()
    {
        return $this->hasMany(Rsvp::class);
    }

    public function visitors()
    {
        return $this->hasMany(InvitationVisitor::class);
    }

    /**
     * Relasi ke Order
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
