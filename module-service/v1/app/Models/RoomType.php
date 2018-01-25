<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomType extends Model
{
    protected $table = 'room_type';
    public $timestamps = false;
    protected $hidden = [
        'id', 'hotel_id'
    ];
}
