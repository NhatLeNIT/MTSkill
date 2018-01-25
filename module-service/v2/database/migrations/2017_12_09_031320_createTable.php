<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 50);
            $table->string('email', 50)->unique();
            $table->string('username', 50)->unique();
            $table->string('password', 100);
            $table->string('api_token', 32)->nullable();
            $table->tinyInteger('role')->default(0);
            $table->rememberToken();
            $table->timestamps();
        });
        Schema::create('airline', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 100);
            $table->string('city_name', 50);
        });
        Schema::create('flight', function (Blueprint $table) {
            $table->increments('id');
            $table->string('code', 10)->unique();
            $table->date('from_date');
            $table->date('to_date');
            $table->time('flight_time');
            $table->time('arrival_time');
            $table->string('from_city_name', 50);
            $table->string('to_city_name', 50);
            $table->integer('airline_id')->unsigned();
            $table->integer('price');
            $table->foreign('airline_id')->references('id')->on('airline')->onUpdate('cascade')->onDelete('cascade');
        });
        Schema::create('book_flight', function (Blueprint $table) {
            $table->increments('id');
            $table->string('flight_type', 20);
            $table->date('from_date');
            $table->time('from_time');
            $table->date('return_date')->nullable();
            $table->time('return_time')->nullable();
            $table->string('from_city_name', 50);
            $table->string('to_city_name', 50);
            $table->string('flight_class', 20);
            $table->integer('total_adults');
            $table->integer('total_children');
            $table->timestamps();
        });
        Schema::create('customer', function (Blueprint $table) {
            $table->increments('id');
            $table->string('first_name', 20);
            $table->string('last_name', 30);
        });
        Schema::create('book_flight_detail', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('book_flight_id')->unsigned();
            $table->integer('customer_id')->unsigned();
            $table->foreign('book_flight_id')->references('id')->on('book_flight')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('customer')->onUpdate('cascade')->onDelete('cascade');
        });
        Schema::create('hotel', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 100);
            $table->string('city_name', 50);
            $table->text('description');
            $table->integer('capacity');
        });
        Schema::create('room_type', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 50);
            $table->integer('price');
            $table->integer('hotel_id')->unsigned();
            $table->foreign('hotel_id')->references('id')->on('hotel')->onUpdate('cascade')->onDelete('cascade');
        });
        Schema::create('hotel_image', function (Blueprint $table) {
            $table->increments('id');
            $table->string('url', 200);
            $table->integer('hotel_id')->unsigned();
            $table->foreign('hotel_id')->references('id')->on('hotel')->onUpdate('cascade')->onDelete('cascade');
        });
        Schema::create('book_hotel', function (Blueprint $table) {
            $table->increments('id');
            $table->date('check_in_date');
            $table->date('check_out_date');
            $table->integer('hotel_id')->unsigned();
            $table->integer('total_guests');
            $table->integer('total_rooms');
            $table->string('room_type', 20);
            $table->timestamps();
        });
        Schema::create('book_hotel_detail', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('book_hotel_id')->unsigned();
            $table->integer('customer_id')->unsigned();
            $table->foreign('book_hotel_id')->references('id')->on('book_hotel')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('customer')->onUpdate('cascade')->onDelete('cascade');
        });
        Schema::create('transaction', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title', 10);
            $table->string('first_name', 20);
            $table->string('last_name', 30);
            $table->string('email', 100);
            $table->string('phone', 20);
            $table->string('payment_method', 20);
            $table->string('card_name', 50)->nullable();
            $table->string('card_number', 20)->nullable();
            $table->integer('ccv')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('airline');
        Schema::dropIfExists('flight');
        Schema::dropIfExists('flight_book');
        Schema::dropIfExists('customer');
        Schema::dropIfExists('book_flight_detail');
        Schema::dropIfExists('hotel');
        Schema::dropIfExists('room_type');
        Schema::dropIfExists('hotel_image');
        Schema::dropIfExists('hotel_book');
        Schema::dropIfExists('book_hotel_detail');
        Schema::dropIfExists('transaction');
    }
}
