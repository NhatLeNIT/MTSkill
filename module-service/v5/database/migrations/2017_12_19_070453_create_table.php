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
            $table->string('username')->unique();
            $table->string('password');
            $table->string('api_token', 32)->unique()->nullable();
            $table->integer('role');
        });
        Schema::create('airline', function (Blueprint $table) {
            $table->increments('id');
            $table->string('airline_name', 200)->unique();
            $table->string('city_name', 100);
        });
        Schema::create('flight', function (Blueprint $table) {
            $table->increments('id');
            $table->string('code', 10)->unique();
            $table->date('from_date');
            $table->date('to_date');
            $table->time('flight_time');
            $table->time('arrival_time');
            $table->string('from_city_name', 100);
            $table->string('to_city_name', 100);
            $table->unsignedInteger('airline_id');
            $table->integer('price');
            $table->foreign('airline_id')->references('id')->on('airline')->onUpdate('cascade')->onDelete('cascade');
        });
        Schema::create('flight_book', function (Blueprint $table) {
            $table->increments('id');
            $table->string('flight_type', 50);
            $table->date('from_date');
            $table->time('from_time');
            $table->date('return_date')->nullable();
            $table->time('return_time')->nullable();
            $table->string('from_city_name', 100);
            $table->string('to_city_name', 100);
            $table->string('flight_class', 100);
            $table->integer('total_adults');
            $table->integer('total_children');
        });
        Schema::create('customer', function (Blueprint $table) {
            $table->increments('id');
            $table->string('first_name', 30);
            $table->string('last_name', 50);
        });
        Schema::create('flight_book_detail', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('flight_book_id');
            $table->unsignedInteger('customer_id');
            $table->foreign('flight_book_id')->references('id')->on('flight_book')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('customer')->onUpdate('cascade')->onDelete('cascade');
        });
        Schema::create('hotel', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 100)->unique();
            $table->string('city_name', 100);
            $table->text('description');
            $table->integer('capacity');
        });
        Schema::create('hotel_image', function (Blueprint $table) {
            $table->increments('id');
            $table->string('url', 100);
            $table->unsignedInteger('hotel_id');
            $table->foreign('hotel_id')->references('id')->on('hotel')->onUpdate('cascade')->onDelete('cascade');
        });
        Schema::create('room_type', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 100);
            $table->integer('price');
            $table->unsignedInteger('hotel_id');
            $table->foreign('hotel_id')->references('id')->on('hotel')->onUpdate('cascade')->onDelete('cascade');
        });
        Schema::create('hotel_book', function (Blueprint $table) {
            $table->increments('id');
            $table->date('check_in_date');
            $table->date('check_out_date');
            $table->unsignedInteger('hotel_id');
            $table->integer('total_guests');
            $table->integer('total_rooms');
            $table->integer('room_type');
            $table->foreign('hotel_id')->references('id')->on('hotel')->onUpdate('cascade')->onDelete('cascade');
        });
        Schema::create('hotel_book_detail', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('hotel_book_id');
            $table->unsignedInteger('customer_id');
            $table->foreign('hotel_book_id')->references('id')->on('hotel_book')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('customer')->onUpdate('cascade')->onDelete('cascade');
        });
        Schema::create('transaction', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title', 20);
            $table->string('first_name', 20);
            $table->string('last_name', 20);
            $table->string('email', 100);
            $table->string('phone', 20);
            $table->string('payment_method', 50);
            $table->string('card_name', 50)->nullable();
            $table->string('card_number', 20)->nullable();
            $table->string('ccv', 20)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('create_table');
    }
}
