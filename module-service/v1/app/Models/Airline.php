<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Airline extends Model
{
    protected $table = "airline";
    public $timestamps = false;

    public function flights() {
        return $this->hasMany("App\Flight", "airline_id");
    }
}
