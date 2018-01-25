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
use Illuminate\Support\Facades\Validator;

class HotelController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'capacity' => 'integer',
            'room_types.price' => 'integer'
        ]);
        if ($validator->fails())
            return response()->json(['message' => 'Data cannot be processed'], 422);
        $hotel = new Hotel();
        $hotel->name = $request->name;
        $hotel->city_name = $request->city_name;
        $hotel->description = $request->description;
        $hotel->capacity = $request->capacity;
        try {
            $hotel->save();
            $images = $request->images;
            foreach ($images as $image) {
                $hotelImageObj = new HotelImage();
                $hotelImageObj->hotel_id = $hotel->id;
                $hotelImageObj->url = $image['url'];
                $hotelImageObj->save();
            }
            $room_types = $request->room_types;
            foreach ($room_types as $room_type) {
                $roomTypeObj = new RoomType();
                $roomTypeObj->hotel_id = $hotel->id;
                $roomTypeObj->name = $room_type['name'];
                $roomTypeObj->price = $room_type['price'];
                $roomTypeObj->save();
            }
            return response()->json(['message' => 'create success'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Data cannot be processed'], 422);
        }
    }

    public function index($city_name)
    {
        $data = Hotel::with(['images', 'room_types'])
            ->select(['id as hotel_id', 'name as hotel_name', 'city_name', 'description', 'capacity as room_capacity'])
            ->where(['city_name' => $city_name])
            ->get();
        return response()->json($data, 200);
    }

    public function book(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'check_in_date' => 'date_format:Y-m-d',
            'check_out_date' => 'date_format:Y-m-d',
            'total_guests' => 'integer',
            'total_rooms' => 'integer'
        ]);
        if ($validator->fails())
            return response()->json(['message' => 'Data cannot be processed'], 422);
        $book = new HotelBook();
        $book->check_in_date = $request->check_in_date;
        $book->check_out_date = $request->check_out_date;
        $book->hotel_id = $request->hotel_id;

        $book->total_guests = $request->total_guests;
        $book->total_rooms = $request->total_rooms;
        $book->room_type = $request->room_type;
        try {
            $book->save();
            $guests = $request->guests;
            foreach ($guests as $guest) {
                $guestObj = new Customer();
                $guestObj->first_name = $guest['first_name'];
                $guestObj->last_name = $guest['last_name'];
                $guestObj->save();

                $bookDetail = new HotelBookDetail();
                $bookDetail->hotel_book_id = $book->id;
                $bookDetail->customer_id = $guestObj->id;
                $bookDetail->save();
            }
            $data = $request->all();
            unset($data['token']);
            $data['hotel_book_id'] = $book->id;
            return response()->json($data, 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Data cannot be processed'], 422);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'capacity' => 'integer',
            'room_types.price' => 'integer'
        ]);
        if ($validator->fails())
            return response()->json(['message' => 'Data cannot be updated'], 422);

        $hotel = Hotel::find($id);
        if (!$hotel)
            return response()->json(['message' => 'Data cannot be updated'], 422);
        if (!empty($request->hotel_name))
            $hotel->name = $request->hotel_name;
        if (!empty($request->city_name))
            $hotel->city_name = $request->city_name;
        if (!empty($request->description))
            $hotel->description = $request->description;
        if (!empty($request->capacity))
            $hotel->capacity = $request->capacity;
        try {
            $hotel->save();
            if (!empty($request->room_types)) {
                RoomType::where('hotel_id', $id)->delete();
                $room_types = $request->room_types;
                foreach ($room_types as $room_type) {
                    $roomTypeObj = new RoomType();
                    $roomTypeObj->hotel_id = $id;
                    $roomTypeObj->name = $room_type['name'];
                    $roomTypeObj->price = $room_type['price'];
                    $roomTypeObj->save();
                }

            }
            if (!empty($request->images)) {
                HotelImage::where('hotel_id', $id)->delete();
                $images = $request->images;
                foreach ($images as $image) {
                    $hotelImageObj = new HotelImage();
                    $hotelImageObj->hotel_id = $hotel->id;
                    $hotelImageObj->url = $image['url'];
                    $hotelImageObj->save();
                }
            }
            return response()->json(['message' => 'update success'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Data cannot be updated'], 400);
        }
    }

    public function destroy($id)
    {
        $hotel = Hotel::find($id);
        if(!$hotel)
            return response()->json(['message' => 'Data cannot be deleted'], 400);
        try {
            $hotel->delete();
            return response()->json(['message' => 'delete success'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Data cannot be deleted'], 400);
        }
    }
}
