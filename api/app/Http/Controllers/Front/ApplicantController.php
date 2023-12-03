<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApplicantStoreRequest;
use App\Http\Resources\ApplicantResource;
use App\Http\Resources\JobCollection;
use App\Http\Resources\JobResource;
use App\Models\Applicant;
use App\Models\Job;
use App\Traits\CommonTrait;
use App\Traits\FileUploadTrait;
use Illuminate\Http\Request;

class ApplicantController extends Controller
{
    use CommonTrait, FileUploadTrait;

    public function jobs(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $jobs = Job::query();
        if ($search) {
            $jobs->whereLike(['title','job_context'], $search);
        }

        return new JobCollection($jobs->orderBy('id','DESC')->paginate($itemsPerPage));
    }

    public function singleJob(Request $request, Job $job)
    {
        return new JobResource($job);
    }
    /**
     * @param \App\Http\Requests\ApplicantStoreRequest $request
     * @return \App\Http\Resources\ApplicantResource
     */
    public function store(ApplicantStoreRequest $request)
    {
        $data = $request->validated();
        unset($data['image']);
        unset($data['cv_file']);
        if ($request->file('image')){
            $img = $this->uploadPhoto($request->file('image'),'/job/applicant');
            $data['image'] = $img;
        }
        if ($request->file('cv_file')){
            $cv = $this->uploadFile($request->file('cv_file'),'job/cv');
            $data['cv_file'] = $cv;
        }
        $data += $this->storeMetadata($request);
        $applicant = Applicant::create($data);
        return new ApplicantResource($applicant);
    }
}
