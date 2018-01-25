<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
//        FLIGHT
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 50);
            $table->string('email', 30)->unique();
            $table->string('username', 20)->unique();
            $table->string('password', 60);
            $table->string('api_token', 32)->unique()->nullable();
            $table->integer('role')->default(1); // 0: user 1: admin
            $table->rememberToken();
            $table->timestamps();
        });
        Schema::create('airline', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 100)->unique();
            $table->string('city_name', 50);
        });
        Schema::create('flight', function (Blueprint $table) {
            $table->increments('id');
            $table->string("code", 10)->unique();
            $table->date('from_date');
            $table->date('to_date');
            $table->time('flight_time');
            $table->time('arrival_time');
            $table->string('from_city_name');
            $table->string('to_city_name');
            $table->integer('airline_id')->unsigned();
            $table->integer('price');
            $table->foreign('airline_id')->references('id')->on('airline')->onUpdate('cascade')->onDelete('cascade');
        });
        Schema::create('flight_book', function (Blueprint $table) {
            $table->increments('id');
            $table->string('flight_type', 50);
            $table->date('from_date');
            $table->date('return_date')->nullable();
            $table->time('from_time');
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
            $table->string("first_name", 10);
            $table->string("last_name", 20);
        });
        Schema::create('flight_book_detail', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('flight_book_id')->unsigned();
            $table->integer('customer_id')->unsigned();
            $table->foreign('flight_book_id')->references('id')->on('flight_book')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('customer')->onUpdate('cascade')->onDelete('cascade');
        });
//        HOTEL
        Schema::create('hotel', function (Blueprint $table) {
            $table->increments('id');
            $table->string("name", 100);
            $table->string("city_name", 50);
            $table->longText("description");
            $table->integer("capacity");
        });
        Schema::create('room_type', function (Blueprint $table) {
            $table->increments('id');
            $table->string("name");
            $table->float("price");
            $table->integer("hotel_id")->unsigned();
            $table->foreign("hotel_id")->references("id")->on("hotel")->onUpdate("cascade")->onDelete("cascade");
        });
        Schema::create('hotel_image', function (Blueprint $table) {
            $table->increments('id');
            $table->string("url");
            $table->integer("hotel_id")->unsigned();
            $table->foreign("hotel_id")->references("id")->on("hotel")->onUpdate("cascade")->onDelete("cascade");
        });
        Schema::create('hotel_book', function (Blueprint $table) {
            $table->increments('id');
            $table->dateTime("check_in_date");
            $table->dateTime("check_out_date");
            $table->integer("hotel_id")->unsigned();
            $table->integer("total_rooms");
            $table->integer("total_guests");
            $table->string("room_type");
            $table->timestamps();
            $table->foreign("hotel_id")->references("id")->on("hotel")->onUpdate("cascade")->onDelete("cascade");
        });
        Schema::create('hotel_book_detail', function (Blueprint $table) {
            $table->increments('id');
            $table->integer("hotel_book_id")->unsigned();
            $table->integer("customer_id")->unsigned();
            $table->foreign("hotel_book_id")->references("id")->on("hotel_book")->onUpdate("cascade")->onDelete("cascade");
            $table->foreign("customer_id")->references("id")->on("customer")->onUpdate("cascade")->onDelete("cascade");
        });
//        TRANSACTION
        Schema::create('transaction', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title', 5);
            $table->string('first_name', 20);
            $table->string('last_name', 50);
            $table->string('email', 100);
            $table->string('phone', 20);
            $table->string('payment_method', 20);
            $table->string('card_name', 20)->nullable();
            $table->string('card_number', 20)->nullable();
            $table->string('ccv', 10)->nullable();
            $table->tinyInteger('status');
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
    }
}
