<?php

namespace App\Http\Controllers;

use App\Http\Requests\PushNotificationStoreRequest;
use App\Http\Requests\PushNotificationUpdateRequest;
use App\Http\Resources\PushNotificationCollection;
use App\Http\Resources\PushNotificationResource;
use App\Models\PushNotification;
use App\Traits\NotificationTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\Request;

class PushNotificationController extends Controller
{
    use NotificationTrait, ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\PushNotificationCollection
     */
    public function index(Request $request)
    {

        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $pushNotifications = PushNotification::query();
        if ($search) {
            $pushNotifications->whereLike(['subject','message'], $search);
        }
        $pushNotifications = $pushNotifications->with([
            'user'=>function($q){$q->select('id','first_name','last_name');},
            'role'=>function($q){$q->select('id','name');},
        ])->orderBy('id','DESC')->paginate($itemsPerPage);
        return new PushNotificationCollection($pushNotifications);
    }

    /**
     * @param \App\Http\Requests\PushNotificationStoreRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(PushNotificationStoreRequest $request)
    {
        $this->storeNotification($request->validated());
        return response()->json(['status'=>'success','message'=>'Successfully notified'],200);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\PushNotification $pushNotification
     * @return \App\Http\Resources\PushNotificationResource
     */
    public function show(Request $request, PushNotification $pushNotification)
    {
        return new PushNotificationResource($pushNotification);
    }

    /**
     * @param \App\Http\Requests\PushNotificationUpdateRequest $request
     * @param \App\Models\PushNotification $pushNotification
     * @return \App\Http\Resources\PushNotificationResource
     */
    public function update(PushNotificationUpdateRequest $request, PushNotification $pushNotification)
    {
        $pushNotification->update($request->validated());

        return new PushNotificationResource($pushNotification);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\PushNotification $pushNotification
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, PushNotification $pushNotification)
    {
        $pushNotification->delete();

        return response()->noContent();
    }

    public function export(Request $request)
    {
        $cols = ['subject', 'user.name','role.name','message','created_at'];
        $headers = ['subject', 'Name','Role', 'message','Date'];
        $total=[];
        $where=[];
        $template='exporter.commonTablePdf2';
        return $this->commonDataExporter('PushNotification', $cols, $headers,$total,$where,$template);

    }

    public function notificationSeen(Request $request, PushNotification $pushNotification)
    {
        $pushNotification->update(['is_seen'=>1]);
        return response()->json(['status'=>'success','message'=>'Seen updated successfully'],200);
    }
}
