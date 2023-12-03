<?php

namespace App\Http\Controllers\AuthCommon;

use App\Http\Controllers\Controller;
use App\Http\Requests\ComplainStoreRequest;
use App\Http\Requests\ComplainUpdateRequest;
use App\Http\Resources\ComplainCollection;
use App\Http\Resources\ComplainResource;
use App\Models\Complain;
use App\Models\PushNotification;
use App\Traits\CommonTrait;
use App\Traits\PushNotificationTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\Request;

class ComplainController extends Controller
{
    use ReportTrait;
    use CommonTrait, PushNotificationTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\ComplainCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $sort_by = request('sort_by');
        $sort_order = request('sort_order');
        $complains = Complain::query();
        $complains->where(['user_id'=>auth()->id()]);
        if ($search) {
            $complains->whereLike(['subject','review'], $search);
        }
        if ($sort_by && $sort_order) $complains->orderBy($sort_by,$sort_order);
        else $complains->orderBy('id','DESC');
        $complains = $complains->paginate($itemsPerPage);
        return new ComplainCollection($complains);
    }

    /**
     * @param \App\Http\Requests\ComplainStoreRequest $request
     * @return \App\Http\Resources\ComplainResource
     */
    public function store(ComplainStoreRequest $request)
    {
        $data = $request->validated();
        $data += ['user_id'=>auth()->id(),'status'=>0];
        $data += $this->storeMetadata($request);
        $complain = Complain::create($data);
        $this->adminNotify('New Complain created',$data['message'],'admin-notify-channel-','/admin/notification/complain');
        return new ComplainResource($complain);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Complain $complain
     * @return \App\Http\Resources\ComplainResource
     */
    public function show(Request $request, Complain $complain)
    {
        return new ComplainResource($complain);
    }

    /**
     * @param \App\Http\Requests\ComplainUpdateRequest $request
     * @param \App\Models\Complain $complain
     * @return \App\Http\Resources\ComplainResource
     */
    public function update(ComplainUpdateRequest $request, Complain $complain)
    {
        $data = $request->validated();
        $data += ['user_id'=>auth()->id()];
        $data += $this->updateMetadata($request);
        $complain->update($data);
        $this->adminNotify('New Complain Update',$data['message'],'admin-notify-channel-','/admin/notification/complain');

        return new ComplainResource($complain);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Complain $complain
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Complain $complain)
    {
        if ($complain->user_id == auth()->id() && $complain->status == 0 ) $complain->delete();

        return response()->noContent();
    }

    public function export(Request $request)
    {
        $search = request('search');
        $cols = ['subject', 'message','review','status'];
        $headers = ['subject', 'message','review', 'status'];
        $total=[];
        $where=[];
        $where[]=[
            'name'=>'user_id',
            'value'=>auth()->id()
        ];

        $template='exporter.commonTablePdf2';
        return $this->commonDataExporter('Complain', $cols, $headers,$total,$where,$template);

    }
}
