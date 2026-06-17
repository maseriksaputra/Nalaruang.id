<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvitationVisitor extends Model
{
    protected $guarded = ['id'];

    public function invitation()
    {
        return $this->belongsTo(Invitation::class);
    }
}
