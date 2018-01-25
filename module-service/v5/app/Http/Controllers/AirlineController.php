<?php

namespace App\Http\Controllers;

use App\Models\Airline;
use App\Models\Customer;
use App\Models\Flight;
use App\Models\FlightBook;
use App\Models\FlightBookDetail;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Mockery\Exception;

class AirlineController extends Controller
{
    public function storeAirlineCompany(Request $request)
    {
        $airline = new Airline();
        $airline->airline_name = $request->airline_name;
        $airline->city_name = $request->city_name;
        try {
            $airline->save();
            return response()->json(['message' => 'create success', 'id' => $airline->id], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Data cannot be processed'], 422);
        }
    }

    public function storeAirlineFlight(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'from_date' => 'date_format:Y-m-d',
            'to_date' => 'date_format:Y-m-d',
            'price' => 'integer'
        ]);
        if ($validator->fails())
            return response()->json(['message' => 'Data cannot be processed'], 422);
        $flight = new Flight();
        $flight->code = strtoupper(substr($request->from_city_name, 0, 1) . substr($request->to_city_name, 0, 1) . str_random(8));
        $flight->from_date = $request->from_date;
        $flight->to_date = $request->to_date;
        $flight->flight_time = $request->flight_time;
        $flight->arrival_time = $request->arrival_time;
        $flight->from_city_name = $request->from_city_name;
        $flight->to_city_name = $request->to_city_name;
        $flight->airline_id = $request->airline_id;
        $flight->price = $request->price;
        try {
            $flight->save();
            return response()->json(['message' => 'create success', 'id' => $flight->id], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Data cannot be processed'], 422);
        }
    }

    public function indexFlight($departure_date, $departure_city_name, $destination_city_name)
    {
        $request = [];
        $request['departure_date'] = $departure_date;
        $request['departure_city_name'] = $departure_city_name;
        $request['destination_city_name'] = $destination_city_name;

        $validator = Validator::make($request, [
            'departure_date' => 'date_format:Y-m-d'
        ]);
        if ($validator->fails())
            return response()->json(['message' => 'Data cannot be processed'], 422);
        $data = Flight::select(['flight.id as flight_id', 'code as flight_code', 'flight_time as departure_time', 'arrival_time', 'airline_id', 'airline_name', 'from_date as departure_date', 'from_city_name as departure_city_name', 'to_city_name as destination_city_name'])
            ->join('airline', 'airline.id', 'airline_id')
            ->where(['from_date' => $departure_date, 'from_city_name' => $departure_city_name, 'to_city_name' => $destination_city_name])
            ->get();
        return response()->json($data, 200);
    }

    public function bookFlight(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'from_date' => 'date_format:Y-m-d',
            'return_date' => 'date_format:Y-m-d',
            'total_adults' => 'integer',
            'total_children' => 'integer'
        ]);
        if($validator->fails())
            return response()->json(['message' => 'Data cannot be processed'], 422);
        $book = new FlightBook();
        $book->flight_type = $request->flight_type;
        $book->from_date = $request->from_date;
        $book->from_time = $request->from_time;
        if(strtoupper('return flight') === strtoupper($request->flight_type)) {
            $book->return_date = $request->return_date;
            $book->return_time = $request->return_time;
        }
        $book->from_city_name = $request->from_city_name;
        $book->to_city_name = $request->to_city_name;
        $book->flight_class = $request->flight_class;
        $book->total_adults = $request->total_adults;
        $book->total_children = $request->total_children;
        try{
            $book->save();
            $passengers = $request->passengers;
            foreach ($passengers as $passenger) {
                $passengerObj = new Customer();
                $passengerObj->first_name = $passenger['first_name'];
                $passengerObj->last_name = $passenger['last_name'];
                $passengerObj->save();

                $bookDetail = new FlightBookDetail();
                $bookDetail->flight_book_id = $book->id;
                $bookDetail->customer_id = $passengerObj->id;
                $bookDetail->save();
            }
            $data = $request->all();
            unset($data['token']);
            $data['flight_book_id'] = $book->id;
            return response()->json($data, 422);
        }
        catch (\Exception $e) {
            return response()->json(['message' => 'Data cannot be processed'], 422);
        }
    }

    public function updateFlight(Request $request, $id)
    {
        $flight = Flight::find($id);
        if(!$flight)
            return response()->json(['message' => 'Data cannot be updated'], 422);
        $validator = Validator::make($request->all(), [
            'from_date' => 'date_format:Y-m-d',
            'to_date' => 'date_format:Y-m-d',
            'price' => 'integer'
        ]);
        if($validator->fails())
            return response()->json(['message' => 'Data cannot be updated'], 422);

        if(!empty($request->from_date))
            $flight->from_date = $request->from_date ;
        if(!empty($request->to_date))
            $flight->to_date = $request->to_date ;
        if(!empty($request->flight_time))
            $flight->flight_time = $request->flight_time ;
        if(!empty($request->arrival_time))
            $flight->arrival_time = $request->arrival_time ;
        if(!empty($request->from_city_name))
            $flight->from_city_name = $request->from_city_name ;
        if(!empty($request->to_city_name))
            $flight->to_city_name = $request->to_city_name ;
        if(!empty($request->airline_id))
            $flight->airline_id = $request->airline_id ;
        if(!empty($request->price))
            $flight->price = $request->price;
        try {
            $flight->save();
            return response()->json(['message' => 'update success'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Data cannot be updated'], 422);
        }
    }

    public function destroyFlight($id)
    {
        $flight = Flight::find($id);
        if(!$flight)
            return response()->json(['message' => 'Data cannot be deleted'], 422);
        try {
            $flight->delete();
            return response()->json(['message' => 'delete success'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Data cannot be deleted'], 422);
        }
    }
}
