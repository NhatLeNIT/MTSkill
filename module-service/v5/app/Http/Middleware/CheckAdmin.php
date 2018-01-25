<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class CheckAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(1 !== Auth::guard('api')->user()->role)
            return response()->json(['message' => 'Unauthorized user.'], 401);
        return $next($request);
    }
}
