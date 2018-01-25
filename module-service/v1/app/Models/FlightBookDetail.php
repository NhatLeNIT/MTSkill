<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlightBookDetail extends Model
{
    protected $table = 'flight_book_detail';
    public $timestamps = false;

    public function flight_book() {
        return $this->belongsTo('App\Models\FlightBook', "flight_book_id");
    }
    public function passenger(){
        return $this->hasOne('App\Models\Customer', 'id');
    }
}
