<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::middleware('auth:api')->get('/user', function (Request $request) {
//    return $request->user();
//});
Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('login', 'Auth\LoginController@login');
        Route::get('logout', 'Auth\LoginController@logout');
    });
    Route::middleware('auth:api')->group(function (){
//        AIRLINE
        Route::post('airline', 'AirlineController@storeAirlineCompany');
        Route::post('flight', 'AirlineController@storeAirlineFlight');
        Route::get('flight/{departure_date}/{departure_city_name}/{destination_city_name}', 'AirlineController@indexFlight');
        Route::post('flight-book', 'AirlineController@bookFlight');
        Route::put('flight/{id}', 'AirlineController@updateFlight');
        Route::delete('flight/{id}', 'AirlineController@destroyFlight');

//        HOTEL
        Route::post('hotel', 'HotelController@store');
        Route::get('hotel/{city_name}', 'HotelController@index');
        Route::post('hotel-book', 'HotelController@book');
        Route::put('hotel/{id}', 'HotelController@update');
        Route::delete('hotel/{id}', 'HotelController@destroy');

//        TRANSACTION
        Route::post('transaction', 'TransactionController@store');
    });
});
