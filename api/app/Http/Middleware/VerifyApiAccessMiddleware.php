<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VerifyApiAccessMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $allowedHosts = explode(',', env('ALLOWED_DOMAINS'));
        $requestHost = parse_url($request->headers->get('origin'),  PHP_URL_HOST);
        /*if (
            !(App::environment('local'))
            && (
                !$request->header('app-access-token')
                || $request->header('app-access-token') !== env('APP_ACCESS_TOKEN')
            )
        ) {
            return response()->json(['Message' => 'You do not access to this api.'], 403);
        }*/

        if(!app()->runningUnitTests() && !app()->environment('local')) {
            if(!in_array($requestHost, $allowedHosts, false) && (!$request->header('app-access-token')
                || $request->header('app-access-token') != env('APP_ACCESS_TOKEN')) ) {
                return $this->errorInfo($requestHost, $request);
            }
        }

        return $next($request);
    }
    private function errorInfo($requestHost, $request){
        $requestInfo = [
            'host' => $requestHost,
            'ip' => $request->getClientIp(),
            'url' => $request->getRequestUri(),
            'agent' => $request->header('User-Agent'),
        ];
        logger('access_from_unauthorized_domain_' . date('Y-m-d_H:i:s'), $requestInfo);
        //Log::warning('access_from_unauthorized_domain_' . date('Y-m-d_H:i:s'), $requestInfo);
        return response()->json(['Message' => 'Access denied'], 403);
    }
}
