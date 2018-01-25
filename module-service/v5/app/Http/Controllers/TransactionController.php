<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'email'
        ]);
        if ($validator->fails())
            return response()->json(['message' => 'Data cannot be processed'], 422);
        $transaction = new Transaction();
        $transaction->title = $request->title;
        $transaction->first_name = $request->first_name;
        $transaction->last_name = $request->last_name;
        $transaction->email = $request->email;
        $transaction->phone = $request->phone;
        $transaction->payment_method = $request->payment_method;
        if(strtoupper('credit card') === strtoupper($request->payment_method)) {
            $transaction->card_name = $request->card_name;
            $transaction->card_number = $request->card_number;
            $transaction->ccv = $request->ccv;
        }

        try {
            $transaction->save();
            return response()->json(['payment_status' => 'success', 'transaction_id' => $transaction->id], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Data cannot be processed'], 422);
        }
    }
}
