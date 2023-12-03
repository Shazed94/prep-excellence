<?php

namespace App\Http\Controllers;

use App\Http\Requests\ComplainStoreRequest;
use App\Http\Requests\ComplainUpdateRequest2;
use App\Http\Resources\ComplainCollection;
use App\Http\Resources\ComplainResource;
use App\Models\Complain;
use App\Traits\CommonTrait;
use App\Traits\PushNotificationTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\Request;

class ComplainController extends Controller
{
    use CommonTrait,PushNotificationTrait, ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\ComplainCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $complains = Complain::query();
        if ($search) {
            $complains->whereLike(['subject','review'], $search);
        }
        $complains = $complains->with(['user.role'])->orderBy('id','DESC')->paginate($itemsPerPage);
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
     * @param \App\Http\Requests\ComplainUpdateRequest2 $request
     * @param \App\Models\Complain $complain
     * @return \App\Http\Resources\ComplainResource
     */
    public function update(ComplainUpdateRequest2 $request, Complain $complain)
    {
        $data = $request->validated();
        $data += $this->updateMetadata($request);
        $complain->update($data);

        return new ComplainResource($complain);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Complain $complain
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Complain $complain)
    {
        $complain->delete();

        return response()->noContent();
    }

    public function export(Request $request)
    {
        $cols = ['user.name','subject','message', 'review', 'status','createdBy.name','created_at'];
        $headers = ['Name','subject','message', 'review', 'status','created by','Date'];
        $total=[];
        $where=[];
        $template='exporter.commonTablePdf2';
        return $this->commonDataExporter('Complain', $cols, $headers,$total,$where,$template);

    }
}
