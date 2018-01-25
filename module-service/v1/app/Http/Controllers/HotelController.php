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
use Illuminate\Support\Facades\Validator;
use DateTime;

class HotelController extends Controller
{
    const ROLE_ADMIN = 1;

//    Create a hotel
    public function store(Request $request)
    {
        if (Auth::guard()->user()->role !== static::ROLE_ADMIN)
            return response()->json(['message' => 'Unauthorized user.'], 401);

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'city_name' => 'required',
            'description' => 'required',
            'room_types' => 'required|array',
            'images' => 'required|array',
            'capacity' => 'required'
        ]);
        if ($validator->fails())
            return response()->json(['message' => 'Data cannot be processed'], 422);

        $isSuccess = true;
        $hotel = new Hotel();
        $hotel->name = $request->name;
        $hotel->city_name = $request->city_name;
        $hotel->description = $request->description;
        $hotel->capacity = $request->capacity;
        if ($hotel->save()) {
//            insert data to table room_types
            $room_types = $request->room_types;
            foreach ($room_types as $room_type) {
                $roomType = new RoomType();
                $roomType->name = $room_type['name'];
                $roomType->price = $room_type['price'];
                $roomType->hotel_id = $hotel->id;
                if (!$roomType->save()) $isSuccess = false;
            }
//            insert data to table hotel_images
            $images = $request->images;
            foreach ($images as $image) {
                $hotelImage = new HotelImage();
                $hotelImage->url = $image['url'];
                $hotelImage->hotel_id = $hotel->id;
                if (!$hotelImage->save()) $isSuccess = false;
            }
        } else $isSuccess = false;
        if ($isSuccess)
            return response()->json(['message' => 'create success'], 200);
        return response()->json(['message' => 'Data cannot be processed'], 422);
    }

//    Query/get hotels list
    public function index($city_name)
    {
        $hotel = Hotel::with(['room_type', 'hotel_image'])->select('id as hotel_id', 'name as hotel_name', 'city_name', 'description', 'capacity')
            ->where('city_name', 'like', "%$city_name%")->get();
        return response()->json($hotel, 200);
    }

//    Book a hotel
    public function book(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'check_in_date' => 'required',
            'check_out_date' => 'required',
            'hotel_id' => 'required',
            'total_guests' => 'required|integer',
            'guests' => 'required|array',
            'total_rooms' => 'required|integer',
            'room_type' => 'required'
        ]);
        if ($validator->fails())
            return response()->json(['message' => 'Data cannot be processed'], 422);
        $isSuccess = true;
        $book = new HotelBook();
        $book->check_in_date = $request->check_in_date;
        $book->check_out_date = $request->check_out_date;
        $book->hotel_id = $request->hotel_id;
        $book->total_rooms = $request->total_rooms;
        $book->total_guests = $request->total_guests;
        $book->room_type = $request->room_type;
        $book->created_at = new DateTime();
        if ($book->save()) {
            $guests = $request->guests;
            foreach ($guests as $guest) {
                $guestObj = new Customer();
                $guestObj->first_name = $guest['first_name'];
                $guestObj->last_name = $guest['last_name'];
                if (!$guestObj->save()) $isSuccess = false;

                $bookDetail = new HotelBookDetail();
                $bookDetail->hotel_book_id = $book->id;
                $bookDetail->customer_id = $guestObj->id;
                if (!$bookDetail->save()) $isSuccess = false;
            }
        } else {
            $isSuccess = false;
        }

        $data = [
            'hotel_book_id' => $book->id,
            'check_in_date' => $request->check_in_date,
            'check_out_date' => $request->check_out_date,
            'hotel_id' => $request->hotel_id,
            'total_guests' => $request->total_guests,
            'guests' => $request->guests,
            'total_rooms' => $request->total_rooms,
            'room_type' => $request->room_type,
        ];
        if ($isSuccess)
            return response()->json($data, 200);
        return response()->json(['message' => 'Data cannot be processed'], 422);
    }

//    Update a hotel
    public function update(Request $request, $id)
    {
        if (Auth::guard()->user()->role !== static::ROLE_ADMIN)
            return response()->json(['message' => 'Unauthorized user.'], 401);

        $hotel = Hotel::find($id);
        if (!$hotel)
            return response()->json(['message' => 'Data cannot be updated'], 400);
        if (!empty($request->name))
            $hotel->name = $request->name;
        if (!empty($request->city_name))
            $hotel->city_name = $request->city_name;
        if (!empty($request->description))
            $hotel->description = $request->description;
        if (!empty($request->capacity))
            $hotel->capacity = $request->capacity;
        if ($hotel->save()) {
            if (!empty($request->room_types)) {
                $room_types = $request->room_types;
                RoomType::where('hotel_id', $id)->delete();
                foreach ($room_types as $room_type) {
                    $roomType = new RoomType();
                    $roomType->name = $room_type['name'];
                    $roomType->price = $room_type['price'];
                    $roomType->hotel_id = $id;
                    $roomType->save();
                }
            }
            if (!empty($request->images)) {
                $images = $request->images;
                HotelImage::where('hotel_id', $id)->delete();
                foreach ($images as $image) {
                    $hotelImage = new HotelImage();
                    $hotelImage->url = $image['url'];
                    $hotelImage->hotel_id = $id;
                    $hotelImage->save();
                }
            }
            return response()->json(['message' => 'update success'], 200);
        }
        return response()->json(['message' => 'Data cannot be updated'], 400);
    }
//    Delete hotel
    public function destroy($id) {
        if (Auth::guard()->user()->role !== static::ROLE_ADMIN)
            return response()->json(['message' => 'Unauthorized user.'], 401);
        HotelImage::where('hotel_id', $id)->delete();
        RoomType::where('hotel_id', $id)->delete();
        $hotel = Hotel::find($id);
        if (!$hotel)
            return response()->json(['message' => 'Data cannot be deleted'], 400);

        if ($hotel->delete())
            return response()->json(['message' => 'delete success'], 200);
        return response()->json(['message' => 'Data cannot be deleted'], 400);
    }
}
