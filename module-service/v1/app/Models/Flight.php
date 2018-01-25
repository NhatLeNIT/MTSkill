<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    protected $table = 'flight';
    public $timestamps = false;

    public function airline() {
        return $this->belongsTo('App\Models\Airline', 'airline_id');
    }
}
