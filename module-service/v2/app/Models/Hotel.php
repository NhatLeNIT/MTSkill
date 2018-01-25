<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    protected $table = 'hotel';
    public $timestamps = false;

    function hotel_image() {
        return $this->hasMany('App\Models\HotelImage', 'hotel_id', 'id');
    }
    function room_type() {
        return $this->hasMany('App\Models\RoomType', 'hotel_id', 'id');
    }
}
