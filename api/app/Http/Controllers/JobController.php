<?php

namespace App\Http\Controllers;

use App\Http\Requests\JobStoreRequest;
use App\Http\Requests\JobUpdateRequest;
use App\Http\Resources\JobCollection;
use App\Http\Resources\JobResource;
use App\Models\Job;
use App\Traits\CommonTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobController extends Controller
{
    use CommonTrait, ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\JobCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $jobs = Job::query();
        if ($search) {
            $jobs->whereLike(['title','job_context'], $search);
        }
        return new JobCollection($jobs->orderBy('id','DESC')->paginate($itemsPerPage));

    }

    /**
     * @param \App\Http\Requests\JobStoreRequest $request
     * @return \App\Http\Resources\JobResource
     */
    public function store(JobStoreRequest $request)
    {
        $data = $request->validated();
        unset($data['image']);
        if ($request->file('image')){
            $img = $this->uploadPhoto($request->file('image'),'/job');
            $data['image'] = $img;
        }
        $data += $this->storeMetadata($request);
        $job = Job::create($data);
        return new JobResource($job);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Job $job
     * @return \App\Http\Resources\JobResource
     */
    public function show(Request $request, Job $job)
    {
        return new JobResource($job);
    }

    /**
     * @param \App\Http\Requests\JobUpdateRequest $request
     * @param \App\Models\Job $job
     * @return \App\Http\Resources\JobResource
     */
    public function update(JobUpdateRequest $request, Job $job)
    {
        $data = $request->validated();
        if ($request->file('image')){
            $img = $this->uploadPhoto($request->file('image'),'/job');
            $data['image'] = $img;
        }
        $data += $this->updateMetadata($request);
        $job->update($data);

        return new JobResource($job);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Job $job
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Job $job)
    {
        $job->delete();

        return response()->noContent();
    }

    public function toggle(Job $job): JsonResponse
    {
        try {
            $job->update(['is_active' => !$job->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }

    public function export(Request $request)
    {
        $cols = ['title', 'vacancy', 'job_context','job_location','salary','last_date', 'createdBy.name'];
        $headers = ['Title', 'Vacancy', 'Job Context','Job Location','Salary','Last Date', 'Created By'];
        return $this->commonDataExporter('Job', $cols, $headers);
    }
}
