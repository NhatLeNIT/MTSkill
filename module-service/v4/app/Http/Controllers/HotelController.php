<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Hotel;
use App\Models\HotelBook;
use App\Models\HotelBookDetail;
use App\Models\HotelImage;
use App\Models\RoomType;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class HotelController extends Controller
{
    public function store(Request $request)
    {
        if (1 !== Auth::guard('api')->user()->role)
            return response()->json(['message' => 'Unauthorized user'], 401);
        $isSuccess = true;
        $hotel = new Hotel();
        $hotel->name = $request->name;
        $hotel->city_name = $request->city_name;
        $hotel->description = $request->description;
        $hotel->capacity = $request->capacity;
        if ($hotel->save()) {
            $images = $request->images;
            foreach ($images as $image) {
                $imgObj = new HotelImage();
                $imgObj->hotel_id = $hotel->id;
                $imgObj->url = $image['url'];
                if (!$imgObj->save()) $isSuccess = false;
            }
            $room_types = $request->room_types;
            foreach ($room_types as $room_type) {
                $rtObj = new RoomType();
                $rtObj->hotel_id = $hotel->id;
                $rtObj->name = $room_type['name'];
                $rtObj->price = $room_type['price'];
                if (!$rtObj->save()) $isSuccess = false;
            }
        }
        if ($isSuccess)
            return response()->json(['message' => 'create success'], 200);
        return response()->json(['message' => 'Data cannot be processed'], 422);
    }

    public function index($city_name)
    {
        $data = Hotel::with(['images', 'room_types'])
            ->select(['id as hotel_id', 'name as hotel_name', 'city_name', 'description', 'capacity as room_capacity'])
            ->where('city_name', $city_name)
            ->get();
        return response()->json($data, 200);
    }

    public function book(Request $request)
    {
        $isSuccess = true;
        $book = new HotelBook();
        $book->check_in_date = $request->check_in_date;
        $book->check_out_date = $request->check_out_date;
        $book->hotel_id = $request->hotel_id;
        $book->total_guests = $request->total_guests;
        $book->total_rooms = $request->total_rooms;
        $book->room_type = $request->room_type;
        if ($book->save()) {
            $guests = $request->guests;
            foreach ($guests as $guest) {
                $gstObj = new Customer();
                $gstObj->first_name = $guest['first_name'];
                $gstObj->last_name = $guest['last_name'];
                if (!$gstObj->save()) $isSuccess = false;
                else {
                    $bookDetail = new HotelBookDetail();
                    $bookDetail->hotel_book_id = $book->id;
                    $bookDetail->customer_id = $gstObj->id;
                    if (!$bookDetail->save()) $isSuccess = false;
                }
            }
        } else $isSuccess = false;

        if ($isSuccess) {
            $data = $request->all();
            $data['hotel_book_id'] = $book->id;
            unset($data['token']);
            return response()->json($data, 200);
        }
        return response()->json(['message' => 'Data cannot be processed'], 422);
    }

    public function update(Request $request, $id)
    {
        if (1 !== Auth::guard('api')->user()->role)
            return response()->json(['message' => 'Unauthorized user'], 401);
        $hotel = Hotel::find($id);
        $isSuccess = true;
        if (!$hotel) {
            return response()->json(['message' => 'Data cannot be updated'], 422);
        }
        if (!empty($request->hotel_name))
            $hotel->name = $request->hotel_name;
        if (!empty($request->city_name))
            $hotel->city_name = $request->city_name;
        if (!empty($request->description))
            $hotel->description = $request->description;
        if (!empty($request->capacity))
            $hotel->capacity = $request->capacity;
        if (!empty($request->images)) {
            HotelImage::where('hotel_id', $id)->delete();
            $images = $request->images;
            foreach ($images as $image) {
                $imgObj = new HotelImage();
                $imgObj->hotel_id = $hotel->id;
                $imgObj->url = $image['url'];
                if (!$imgObj->save()) $isSuccess = false;
            }
        }
        if (!empty($request->room_types)) {
            RoomType::where('hotel_id', $id)->delete();
            $room_types = $request->room_types;
            foreach ($room_types as $room_type) {
                $rtObj = new RoomType();
                $rtObj->hotel_id = $hotel->id;
                $rtObj->name = $room_type['name'];
                $rtObj->price = $room_type['price'];
                if (!$rtObj->save()) $isSuccess = false;
            }
        }

        if (!$hotel->save()) $isSuccess = false;
        if ($isSuccess)
            return response()->json(['message' => 'update success'], 200);
        return response()->json(['message' => 'Data cannot be updated'], 422);
    }

    public function destroy($id)
    {
        $hotel = Hotel::find($id);
        if(!$hotel)
            return response()->json(['message' => 'Data cannot be deleted'], 422);
        if($hotel->delete())
            return response()->json(['message' => 'delete success'], 200);
        return response()->json(['message' => 'Data cannot be deleted'], 422);
    }
}
