<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/admin-notification', function () {
    broadcast(new \App\Events\AdminNotificationEvent());
});
Route::get('/user-notification', function () {
    $push = \App\Models\PushNotification::first();
    broadcast(new \App\Events\UserNotifyEvent($push->toArray()));
});
