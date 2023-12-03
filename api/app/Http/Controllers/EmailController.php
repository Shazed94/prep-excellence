<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmailStoreRequest;
use App\Http\Requests\EmailUpdateRequest;
use App\Http\Resources\EmailCollection;
use App\Http\Resources\EmailResource;
use App\Models\Email;
use App\Models\PushNotification;
use App\Models\SMS;
use App\Models\User;
use App\Traits\NotificationTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\Request;

class EmailController extends Controller
{
    use NotificationTrait, ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\EmailCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $emails = Email::query();
        if ($search) {
            $emails->whereLike(['subject','name','email','message'], $search);
        }

        return new EmailCollection($emails->orderBy('id','DESC')->paginate($itemsPerPage));
    }

    /**
     * @param \App\Http\Requests\EmailStoreRequest $request
     *@return \Illuminate\Http\JsonResponse
     */
    public function store(EmailStoreRequest $request)
    {
        $this->storeNotification($request->validated(),$request->file('file'));
        return response()->json(['status'=>'success','message'=>'Successfully notified'],200);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Email $email
     * @return \App\Http\Resources\EmailResource
     */
    public function show(Request $request, Email $email)
    {
        return new EmailResource($email);
    }

    /**
     * @param \App\Http\Requests\EmailUpdateRequest $request
     * @param \App\Models\Email $email
     * @return \App\Http\Resources\EmailResource
     */
    public function update(EmailUpdateRequest $request, Email $email)
    {
        $email->update($request->validated());

        return new EmailResource($email);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Email $email
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Email $email)
    {
        $email->delete();

        return response()->noContent();
    }
    public function export(Request $request)
    {
        $cols = ['name', 'subject', 'email','message','created_at'];
        $headers = ['name', 'subject', 'email', 'message','Date'];
        $total=[];
        $where=[];
        $template='exporter.commonTablePdf2';
        return $this->commonDataExporter('Email', $cols, $headers,$total,$where,$template);
    }
}
