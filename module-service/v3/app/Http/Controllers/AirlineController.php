<?php

namespace App\Http\Controllers;

use App\Models\Airline;
use App\Models\Customer;
use App\Models\Flight;
use App\Models\FlightBook;
use App\Models\FlightBookDetail;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class AirlineController extends Controller
{
    public function storeAirlineCompany(Request $request)
    {
        if (1 !== Auth::guard()->user()->role)
            return response()->json(['message' => 'Unauthorized user'], 401);
        $airline = new Airline();
        $airline->name = $request->airline_name;
        $airline->city_name = $request->city_name;
        if ($airline->save())
            return response()->json(['message' => 'create success', 'id' => $airline->id], 200);
        return response()->json(['message' => 'Data cannot be processed'], 422);
    }

    public function storeAirlineFlight(Request $request)
    {
        if (1 !== Auth::guard()->user()->role)
            return response()->json(['message' => 'Unauthorized user'], 401);
        $airline = new Flight();
        $airline->code = substr($request->from_city_name, 0,1) . substr($request->to_city_name, 0,1) . $request->airline_id . substr(time(), -4);
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
        return response()->json(['message' => 'Data cannot be processed'], 422);
    }

    public function indexFlight($departure_date, $departure_city_name, $destination_city_name)
    {
        $data = Flight::select(['flight.id as flight_id', 'code as flight_code', 'flight_time as departure_time', 'arrival_time', 'airline_id', 'name as airline_name'])
            ->join('airline', 'airline.id', 'airline_id')
            ->where(['from_date' => $departure_date, 'from_city_name' => $departure_city_name, 'to_city_name' => $destination_city_name])
            ->get();
        return response()->json($data, 200);
    }

    public function bookFlight(Request $request)
    {
        $isSuccess = true;
        $flight_book = new FlightBook();
        $flight_book->flight_type = $request->flight_type;
        $flight_book->from_date = $request->from_date;
        $flight_book->from_time = $request->from_time;
        if (strtoupper('return flight') === strtoupper($request->flight_type)) {
            $flight_book->return_date = $request->return_date;
            $flight_book->return_time = $request->return_time;
        }
        $flight_book->from_city_name = $request->from_city_name;
        $flight_book->to_city_name = $request->to_city_name;
        $flight_book->flight_class = $request->flight_class;
        $flight_book->total_adults = $request->total_adults;
        $flight_book->total_children = $request->total_children;
        if ($flight_book->save()) {
            $passengers = $request->passengers;
            foreach ($passengers as $passenger) {
                $psgObj = new Customer();
                $psgObj->first_name = $passenger['first_name'];
                $psgObj->last_name = $passenger['last_name'];
                if (!$psgObj->save()) $isSuccess = false;

                $flight_book_detail = new FlightBookDetail();
                $flight_book_detail->flight_book_id = $flight_book->id;
                $flight_book_detail->customer_id = $psgObj->id;
                if (!$flight_book_detail->save()) $isSuccess = false;
            }
        } else $isSuccess = false;
        $data = $request->all();
        unset($data['token']);
        $data['flight_book_id'] = $flight_book->id;
        if ($isSuccess)
            return response()->json($data, 200);
        return response()->json(['message' => 'Data cannot be processed'], 422);
    }
    public function updateFlight(Request $request, $id) {
        if (1 !== Auth::guard()->user()->role)
            return response()->json(['message' => 'Unauthorized user'], 401);

        $flight = Flight::find($id);
        if(!$flight) {
            return response()->json(['message' => 'Data cannot be updated'], 422);
        }
        if(!empty($request->from_date)) {
            $flight->from_date = $request->from_date;
        }
        if(!empty($request->to_date)) {
            $flight->to_date = $request->to_date;
        }
        if(!empty($request->flight_time)) {
            $flight->flight_time = $request->flight_time;
        }
        if(!empty($request->arrival_time)) {
            $flight->arrival_time = $request->arrival_time;
        }
        if(!empty($request->from_city_name)) {
            $flight->from_city_name = $request->from_city_name;
        }
        if(!empty($request->to_city_name)) {
            $flight->to_city_name = $request->to_city_name;
        }
        if(!empty($request->airline_id)) {
            $flight->airline_id = $request->airline_id;
        }
        if(!empty($request->price)) {
            $flight->price = $request->price;
        }
        if ($flight->save())
            return response()->json(['message' => 'update success'], 200);
        return response()->json(['message' => 'Data cannot be updated'], 422);
    }
    public function destroyFlight($id){
        if (1 !== Auth::guard()->user()->role)
            return response()->json(['message' => 'Unauthorized user'], 401);

        $flight = Flight::find($id);
        if(!$flight)
            return response()->json(['message' => 'Data cannot be deleted'], 422);
        if($flight->delete())
            return response()->json(['delete' => 'delete success'], 200);
        return response()->json(['message' => 'Data cannot be deleted'], 422);
    }
}
