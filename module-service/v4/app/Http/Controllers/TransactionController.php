<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TransactionController extends Controller
{
    public function store(Request $request) {
        $tsObj = new Transaction();
        $tsObj->title = $request->title;
        $tsObj->first_name = $request->first_name;
        $tsObj->last_name = $request->last_name;
        $tsObj->email = $request->email;
        $tsObj->phone = $request->phone;
        $tsObj->payment_method = $request->payment_method;
        if(strtoupper('credit card') === strtoupper($request->payment_method)) {
            $tsObj->card_name = $request->card_name;
            $tsObj->card_number = $request->card_number;
            $tsObj->ccv = $request->ccv;
        }
        if ($tsObj->save())
            return response()->json(['payment_status' => 'success', 'transaction_id' => $tsObj->id], 200);
        return response()->json(['message' => 'Data cannot be processed'], 422);
    }
}
