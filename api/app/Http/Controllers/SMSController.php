<?php

namespace App\Http\Controllers;

use App\Http\Requests\SMSStoreRequest;
use App\Http\Requests\SMSUpdateRequest;
use App\Http\Resources\SMSCollection;
use App\Http\Resources\SMSResource;
use App\Models\SMS;
use App\Traits\NotificationTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\Request;

class SMSController extends Controller
{
    use NotificationTrait, ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\SMSCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $sMS = SMS::query();
        if ($search) {
            $sMS->whereLike(['subject','message'], $search);
        }
        return new SMSCollection($sMS->orderBy('id','DESC')->paginate($itemsPerPage));
    }

    /**
     * @param \App\Http\Requests\SMSStoreRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(SMSStoreRequest $request)
    {
        $this->storeNotification($request->validated());
        return response()->json(['status'=>'success','message'=>'Successfully notified'],200);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\SMS $sMS
     * @return \App\Http\Resources\SMSResource
     */
    public function show(Request $request, SMS $sMS)
    {
        return new SMSResource($sMS);
    }

    /**
     * @param \App\Http\Requests\SMSUpdateRequest $request
     * @param \App\Models\SMS $sMS
     * @return \App\Http\Resources\SMSResource
     */
    public function update(SMSUpdateRequest $request, SMS $sMS)
    {
        $sMS->update($request->validated());

        return new SMSResource($sMS);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\SMS $sMS
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, SMS $sMS)
    {
        $sMS->delete();

        return response()->noContent();
    }

    public function export(Request $request)
    {
        $cols = ['created_at', 'msisdn', 'text','sms_type'];
        $headers = ['Date', 'Phone Number','Message', 'SMS Type'];
        $total=[];
        $where=[];
        $template='exporter.commonTablePdf2';
        return $this->commonDataExporter('SMS', $cols, $headers,$total,$where,$template);
    }
}
