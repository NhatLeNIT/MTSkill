<?php

namespace App\Http\Controllers;

use App\Models\Airline;
use App\Models\BookFlight;
use App\Models\BookFlightDetail;
use App\Models\Customer;
use App\Models\Flight;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use DateTime;

class AirlineController extends Controller
{
    const ROLE_ADMIN = 1;

    public function storeAirlineCompany(Request $request)
    {
        if (Auth::guard()->user()->role !== static::ROLE_ADMIN)
            return response()->json(['message' => 'Unauthorized user'], 401);

        /*$validator = Validator::make($request->all(), [
            'airline_name' => 'required',
            'city_name' => 'required'
        ]);
        if ($validator->fails())
            return response()->json(['message' => 'Date cannot be processed'], 422);*/
        $airline = new Airline();
        $airline->name = $request->airline_name;
        $airline->city_name = $request->city_name;
        if ($airline->save())
            return response()->json(['message' => 'create success', 'id' => $airline->id], 200);
        return response()->json(['message' => 'Date cannot be processed'], 422);
    }

    public function storeAirlineFlight(Request $request)
    {
        if (Auth::guard()->user()->role !== static::ROLE_ADMIN)
            return response()->json(['message' => 'Unauthorized user'], 401);

        $validator = Validator::make($request->all(), [
            'from_date' => 'required',
            'to_date' => 'required',
            'flight_time' => 'required',
            'arrival_time' => 'required',
            'from_city_name' => 'required',
            'to_city_name' => 'required',
            'airline_id' => 'required|integer',
            'price' => 'required|integer',
        ]);
        if ($validator->fails())
            return response()->json(['message' => 'Date cannot be processed'], 422);
        $code = [
            substr($request->from_city_name, 0, 1),
            substr($request->to_city_name, 0, 1),
            $request->airline_id,
            substr(time(), -4),
        ];
        $airline = new Flight();
        $airline->code = strtoupper(implode('', $code));
        $airline->from_date = $request->from_date;
        $airline->to_date = $request->to_date;
        $airline->flight_time = $request->flight_time;
        $airline->arrival_time = $request->arrival_time;
        $airline->from_city_name = $request->from_city_name;
        $airline->to_city_name = $request->to_city_name;
        $airline->airline_id = $request->airline_id;
        $airline->price = $request->price;
        if ($airline->save())
            return response()->json(['message' => 'create success', 'id' => $airline->id], 200);
        return response()->json(['message' => 'Date cannot be processed'], 422);
    }

    public function indexFlight($departure_date, $departure_city_name, $destination_city_name)
    {
        $flight = Flight::select(['flight.id as flight_id', 'code as flight_code', 'flight_time as departure_time', 'arrival_time', 'airline_id', 'airline.name as airline_name', 'from_city_name as departure_city_name', 'to_city_name as destination_city_name', 'from_date as departure_date'])
            ->where(['from_date' => $departure_date, 'from_city_name' => $departure_city_name, 'to_city_name' => $destination_city_name])
            ->join('airline', 'airline_id', 'airline.id')
            ->get();
        return response()->json($flight, 200);
    }

    public function bookFlight(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'flight_type' => 'required',
            'from_date' => 'required',
            'from_time' => 'required',
            'from_city_name' => 'required',
            'to_city_name' => 'required',
            'flight_class' => 'required',
            'total_adults' => 'required|integer',
            'total_children' => 'required|integer',
            'passengers' => 'array'
        ]);
        if ($validator->fails())
            return response()->json(['message' => 'Date cannot be processed'], 422);
        $isSuccess = true;
        $book = new BookFlight();
        $book->flight_type = $request->flight_type;
        $book->from_date = $request->from_date;
        $book->from_time = $request->from_time;
        if (strtoupper($request->flight_type) === strtoupper('return flight')) {
            $book->return_date = $request->return_date;
            $book->return_time = $request->return_time;
        }
        $book->from_city_name = $request->from_city_name;
        $book->to_city_name = $request->to_city_name;
        $book->flight_class = $request->flight_class;
        $book->total_adults = $request->total_adults;
        $book->total_children = $request->total_children;
        $book->created_at = new DateTime();
        if ($book->save()) {
            $passengers = $request->passengers;
            if (!empty($passengers)) {
                foreach ($passengers as $passenger) {
                    $psgObj = new Customer();
                    $psgObj->first_name = $passenger['first_name'];
                    $psgObj->last_name = $passenger['last_name'];
                    if (!$psgObj->save()) $isSuccess = false;
                    else {
                        $bookDetail = new BookFlightDetail();
                        $bookDetail->book_flight_id = $book->id;
                        $bookDetail->customer_id = $psgObj->id;
                        if (!$bookDetail->save()) $isSuccess = false;
                    }
                }
            }
        } else {
            $isSuccess = false;
        }
        if ($isSuccess) {
            $data = [
                'flight_book_id' => $book->id,
                'flight_type' => $request->flight_type,
                'from_date' => $request->from_date,
                'from_time' => $request->from_time,
                'from_city_name' => $request->from_city_name,
                'to_city_name' => $request->to_city_name,
                'flight_class' => $request->flight_class,
                'total_adults' => $request->total_adults,
                'total_children' => $request->total_children,
                'passengers' => $request->passengers
            ];
            return response()->json($data, 200);
        }
        return response()->json(['message' => 'Date cannot be processed'], 422);
    }

    public function updateFlight(Request $request, $id)
    {
        if (Auth::guard()->user()->role !== static::ROLE_ADMIN)
            return response()->json(['message' => 'Unauthorized user'], 401);
        $flight = Flight::find($id);
        if(!$flight)
            return response()->json(['message' => 'Data cannot be updated'], 400);
        if(!empty($request->from_date))
            $flight->from_date = $request->from_date;
        if(!empty($request->to_date))
            $flight->to_date = $request->to_date;
        if(!empty($request->flight_time))
            $flight->flight_time = $request->flight_time;
        if(!empty($request->arrival_time))
            $flight->arrival_time = $request->arrival_time;
        if(!empty($request->from_city_name))
            $flight->from_city_name = $request->from_city_name;
        if(!empty($request->to_city_name))
            $flight->to_city_name = $request->to_city_name;
        if(!empty($request->airline_id))
            $flight->airline_id = $request->airline_id;
        if(!empty($request->price))
            $flight->price = $request->price;
        if($flight->save())
            return response()->json(['message' => 'update success'], 200);
        return response()->json(['message' => 'Data cannot be updated'], 400);
    }

    public function destroyFlight($id)
    {
        if (Auth::guard()->user()->role !== static::ROLE_ADMIN)
            return response()->json(['message' => 'Unauthorized user'], 401);
        $flight = Flight::find($id);
        if(!$flight)
            return response()->json(['message' => 'Data cannot be deleted'], 400);
        if($flight->delete())
            return response()->json(['message' => 'delete success'], 200);
        return response()->json(['message' => 'Data cannot be deleted'], 400);
    }
}
