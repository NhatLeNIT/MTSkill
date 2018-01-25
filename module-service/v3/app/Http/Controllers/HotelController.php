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
    public function store(Request $request) {
        $isSuccess = true;
        if (1 !== Auth::guard()->user()->role)
            return response()->json(['message' => 'Unauthorized user'], 401);
        $hotel = new Hotel();
        $hotel->name = $request->name;
        $hotel->city_name = $request->city_name;
        $hotel->description = $request->description;
        $hotel->capacity = $request->capacity;
        if($hotel->save()) {
            $room_types = $request->room_types;
            foreach ($room_types as $room_type) {
                $rtObj = new RoomType();
                $rtObj->hotel_id = $hotel->id;
                $rtObj->name = $room_type['name'];
                $rtObj->price = $room_type['price'];
                if(!$rtObj->save()) $isSuccess = false;
            }
            $images = $request->images;
            foreach ($images as $image) {
                $imgObj = new HotelImage();
                $imgObj->hotel_id = $hotel->id;
                $imgObj->url = $image['url'];
                if(!$imgObj->save()) $isSuccess = false;
            }
        } else $isSuccess = false;
        if($isSuccess)
            return response()->json(['message' => 'create success'], 200);
        return response()->json(['message' => 'Data cannot be processed'], 422);
    }
    public function index($city_name) {
        $data = Hotel::with(['hotel_image', 'room_type'])
            ->select(['id as hotel_id', 'name as hotel_name', 'city_name', 'description', 'capacity'])
            ->where('city_name', $city_name)
            ->get();
        return response()->json($data, 200);
    }
    public function book(Request $request) {
        $isSuccess = true;
        $hotel_book = new HotelBook();
        $hotel_book->check_in_date = $request->check_in_date;
        $hotel_book->check_out_date = $request->check_out_date;
        $hotel_book->hotel_id = $request->hotel_id;
        $hotel_book->total_guests = $request->total_guests;
        $hotel_book->total_rooms = $request->total_rooms;
        $hotel_book->room_type = $request->room_type;
        if ($hotel_book->save()) {
            $guests = $request->guests;
            foreach ($guests as $guest) {
                $guestObj = new Customer();
                $guestObj->first_name = $guest['first_name'];
                $guestObj->last_name = $guest['last_name'];
                if (!$guestObj->save()) $isSuccess = false;

                $hotel_book_detail = new HotelBookDetail();
                $hotel_book_detail->hotel_book_id = $hotel_book->id;
                $hotel_book_detail->customer_id = $guestObj->id;
                if (!$hotel_book_detail->save()) $isSuccess = false;
            }
        } else $isSuccess = false;
        $data = $request->all();
        unset($data['token']);
        $data['hotel_book_id'] = $hotel_book->id;
        if ($isSuccess)
            return response()->json($data, 200);
        return response()->json(['message' => 'Data cannot be processed'], 422);
    }
    public function update(Request $request, $id) {
        if (1 !== Auth::guard()->user()->role)
            return response()->json(['message' => 'Unauthorized user'], 401);

        $hotel = Hotel::find($id);
        if(!$hotel) {
            return response()->json(['message' => 'Data cannot be updated'], 422);
        }
        if(!empty($request->hotel_name)) {
            $hotel->name = $request->hotel_name;
        }
        if(!empty($request->city_name)) {
            $hotel->city_name = $request->city_name;
        }
        if(!empty($request->description)) {
            $hotel->description = $request->description;
        }
        if(!empty($request->capacity)) {
            $hotel->capacity = $request->capacity;
        }
        if(!empty($request->room_types)) {
            RoomType::where('hotel_id', $id)->delete();
            $room_types = $request->room_types;
            foreach ($room_types as $room_type) {
                $rtObj = new RoomType();
                $rtObj->hotel_id = $id;
                $rtObj->name = $room_type['name'];
                $rtObj->price = $room_type['price'];
                $rtObj->save();
            }
        }
        if(!empty($request->images)) {
            HotelImage::where('hotel_id', $id)->delete();
            $images = $request->images;
            foreach ($images as $image) {
                $imgObj = new HotelImage();
                $imgObj->hotel_id = $hotel->id;
                $imgObj->url = $image['url'];
                if(!$imgObj->save()) $isSuccess = false;
            }
        }

        if ($hotel->save())
            return response()->json(['message' => 'update success'], 200);
        return response()->json(['message' => 'Data cannot be updated'], 422);
    }
    public function destroy($id) {
        if (1 !== Auth::guard()->user()->role)
            return response()->json(['message' => 'Unauthorized user'], 401);

        $hotel = Hotel::find($id);
        if(!$hotel)
            return response()->json(['message' => 'Data cannot be deleted'], 422);
        if($hotel->delete())
            return response()->json(['delete' => 'delete success'], 200);
        return response()->json(['message' => 'Data cannot be deleted'], 422);
    }
}
