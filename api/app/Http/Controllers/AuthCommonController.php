<?php

namespace App\Http\Controllers;

use App\Http\Resources\PushNotificationCollection;
use App\Models\PushNotification;
use Illuminate\Http\Request;

class AuthCommonController extends Controller
{
    /*
     * method for get individual notifications
     * */
    public function notifications(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 10;
        $search = request('search');
        $pushNotifications = PushNotification::query();
        $pushNotifications->where(['user_id'=>auth()->id()])->orWhere('role_id',auth()->user()->role_id);
        if ($search) {
            $pushNotifications->whereLike(['subject','message'], $search);
        }
        $pushNotifications = $pushNotifications->orderBy('id','DESC')->paginate($itemsPerPage);
        return new PushNotificationCollection($pushNotifications);
    }
}
