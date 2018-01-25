<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlightBook extends Model
{
    protected $table = "flight_book";
    public function flight_book_detail(){
        return $this->hasMany('App\FlightBookDetail', "flight_book_id");
    }
}
