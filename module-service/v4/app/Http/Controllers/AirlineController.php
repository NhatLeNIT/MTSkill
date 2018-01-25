<?php

namespace App\Http\Controllers;

use App\Models\Airline;
use App\Models\Customer;
use App\Models\Flight;
use App\Models\FlightBook;
use App\Models\FlightBookDetail;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Mockery\Exception;

/**
 * Class AirlineController
 * @package App\Http\Controllers
 */
class AirlineController extends Controller
{
    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeAirlineCompany(Request $request)
    {
        if (1 !== Auth::guard('api')->user()->role)
            return response()->json(['message' => 'Unauthorized user'], 401);

        $airline = new Airline();
        $airline->name = $request->airline_name;
        $airline->city_name = $request->city_name;
        if ($airline->save())
            return response()->json(['message' => 'create success', 'id' => $airline->id], 200);
        return response()->json(['message' => 'Data cannot be processed'], 422);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeAirlineFlight(Request $request)
    {
        if (1 !== Auth::guard('api')->user()->role)
            return response()->json(['message' => 'Unauthorized user'], 401);
        $flight = new Flight();
        $flight->code = substr($request->from_city_name, 0, 1) . substr($request->to_city_name, 0, 1) . substr(time(), -4);
        $flight->from_date = $request->from_date;
        $flight->to_date = $request->to_date;
        $flight->flight_time = $request->flight_time;
        $flight->arrival_time = $request->arrival_time;
        $flight->from_city_name = $request->from_city_name;
        $flight->to_city_name = $request->to_city_name;
        $flight->airline_id = $request->airline_id;
        $flight->price = $request->price;
        if ($flight->save())
            return response()->json(['message' => 'create success', 'id' => $flight->id], 200);
        return response()->json(['message' => 'Data cannot be processed'], 422);
    }

    public function indexFlight($departure_date, $departure_city_name, $destination_city_name)
    {
        $data = Flight::select(['flight.id as flight_id', 'code as flight_code', 'flight_time as departure_time', 'arrival_time', 'airline_id', 'name as flight_name', 'from_date as departure_date', 'from_city_name as departure_city_name', 'to_city_name as destination_city_name'])
            ->join('airline', 'airline.id', 'airline_id')
            ->where(['from_date' => $departure_date, 'from_city_name' => $departure_city_name, 'to_city_name' => $destination_city_name])
            ->get();
        return response()->json($data, 200);

    }

    public function bookFlight(Request $request)
    {
        $isSuccess = true;
        $book = new FlightBook();
        $book->flight_type = $request->flight_type;
        $book->from_date = $request->from_date;
        $book->from_time = $request->from_time;
        if (strtoupper('return flight') === strtoupper($request->flight_type)) {
            $book->return_date = $request->return_date;
            $book->return_time = $request->return_time;
        }
        $book->from_city_name = $request->from_city_name;
        $book->to_city_name = $request->to_city_name;
        $book->flight_class = $request->flight_class;
        $book->total_adults = $request->total_adults;
        $book->total_children = $request->total_children;
        if ($book->save()) {
            $passengers = $request->passengers;
            foreach ($passengers as $passenger) {
                $psgObj = new Customer();
                $psgObj->first_name = $passenger['first_name'];
                $psgObj->last_name = $passenger['last_name'];
                if (!$psgObj->save()) $isSuccess = false;

                $bookDetail = new FlightBookDetail();
                $bookDetail->flight_book_id = $book->id;
                $bookDetail->customer_id = $psgObj->id;
                if (!$bookDetail->save()) $isSuccess = false;
            }
        } else $isSuccess = false;
        if ($isSuccess) {
            $data = $request->all();
            $data['flight_book_id'] = $book->id;
            unset($data['token']);
            return response()->json($data, 200);
        }
        return response()->json(['message' => 'Data cannot be processed'], 422);
    }

    public function updateFlight(Request $request, $id)
    {
        if (1 !== Auth::guard('api')->user()->role)
            return response()->json(['message' => 'Unauthorized user'], 401);

        try {
            $flight = Flight::find($id);
            if (!empty($request->from_date))
                $flight->from_date = $request->from_date;
            if (!empty($request->to_date))
                $flight->to_date = $request->to_date;
            if (!empty($request->flight_time))
                $flight->flight_time = $request->flight_time;
            if (!empty($request->arrival_time))
                $flight->arrival_time = $request->arrival_time;
            if (!empty($request->from_city_name))
                $flight->from_city_name = $request->from_city_name;
            if (!empty($request->to_city_name))
                $flight->to_city_name = $request->to_city_name;
            if (!empty($request->airline_id))
                $flight->airline_id = $request->airline_id;
            if (!empty($request->price))
                $flight->price = $request->price;
            $flight->save();
            return response()->json(['message' => 'update success'], 200);
        } catch (\Exception $e) {
//            dd($e);
            return response()->json(['message' => 'Data cannot be updated'], 422);
        }
    }

    public function destroyFlight($id)
    {
        $flight = Flight::find($id);
        if (!$flight)
            return response()->json(['message' => 'Data cannot be deleted'], 422);
        try {
            $flight->delete();
            return response()->json(['message' => 'delete success'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Data cannot be deleted'], 422);
        }
    }
}
