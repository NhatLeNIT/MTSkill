<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{
//    Create transaction
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email',
            'phone' => 'required',
            'payment_method' => 'required'
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
        if (strtoupper($request->payment_method) === strtoupper('credit card')) {
            $transaction->card_name = $request->card_name;
            $transaction->card_number = $request->card_number;
            $transaction->ccv = $request->ccv;
        }
        $transaction->status = 1;
        if (!$transaction->save())
            return response()->json(['message' => 'Data cannot be processed'], 422);
        return response()->json(['payment_status' => $transaction->status === 1 ? 'success' : 'error', 'transaction_id' => $transaction->id], 200);
    }
}
