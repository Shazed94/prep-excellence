<?php

namespace App\Http\Controllers;

use App\Http\Requests\ApplicantStoreRequest;
use App\Http\Requests\ApplicantUpdateRequest;
use App\Http\Resources\ApplicantCollection;
use App\Http\Resources\ApplicantResource;
use App\Models\Applicant;
use App\Models\Job;
use App\Traits\EmailTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\Request;

class ApplicantController extends Controller
{
    use ReportTrait, EmailTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\ApplicantCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $category = request('category');
        $job_id = request('job_id');
        $start_date = request('start_date');
        $end_date = request('end_date');
        $status = $request->status;
        $applicants = Applicant::query();
        if ($search) {
            $applicants->whereLike(['name','email','phone_number','referral'], $search);
        }
        if ($category) $applicants->whereJsonContains('subjects', $category);
        if ($job_id) $applicants->where('job_id', $job_id);
        if ($start_date) $applicants->whereDate('created_at','>=', $start_date);
        if ($end_date) $applicants->whereDate('created_at','<=', $end_date);
        if ($status != null) $applicants->where('status', $status);
        $applicants = $applicants->with(['job'])->orderBy('id','DESC')->paginate($itemsPerPage);
        return new ApplicantCollection($applicants);
    }

    public function getOnlyJobs(Request $request)
    {
        $jobs = Job::all(['id','title']);
        return response()->json(['data'=>$jobs],200);
    }

    /**
     * @param \App\Http\Requests\ApplicantStoreRequest $request
     * @return \App\Http\Resources\ApplicantResource
     */
    public function store(ApplicantStoreRequest $request)
    {
        $data = $request->validated();
        unset($data['image']);
        if ($request->file('image')){
            $img = $this->uploadPhoto($request->file('image'),'job/applicant/');
            $data +=[
                'image'=>$img,
            ];
        }
        $applicant = Applicant::create($data);

        return new ApplicantResource($applicant);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Applicant $applicant
     * @return \App\Http\Resources\ApplicantResource
     */
    public function show(Request $request, Applicant $applicant)
    {
        return new ApplicantResource($applicant);
    }

    /**
     * @param \App\Http\Requests\ApplicantUpdateRequest $request
     * @param \App\Models\Applicant $applicant
     * @return \App\Http\Resources\ApplicantResource
     */
    public function update(ApplicantUpdateRequest $request, Applicant $applicant)
    {
        $data = $request->validated();
        unset($data['image']);
        if ($request->file('image')){
            $img = $this->uploadPhoto($request->file('image'),'job/applicant/');
            $data +=[
                'image'=>$img,
            ];
        }
        $applicant->update($data);

        return new ApplicantResource($applicant);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Applicant $applicant
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Applicant $applicant)
    {
        $applicant->delete();

        return response()->noContent();
    }

    public function statusChange(Request $request, Applicant $applicant, $status)
    {
        $applicant->update(['status'=>$status]);
        $job_title = $applicant->job?$applicant->job->title:'';
        if ($status == 1){
            $subject='Pre-Select';
            $message="
            <p>Congratulations!<br> You are pre-selected for the <b> $job_title </b> position in Prep Excellence.</p>
            ";
            $this->defaultEmail($applicant->name, $applicant->email, $subject,$message);
        }else if($status == 2){
            $subject='Interviewing';
            $message="
            <p>Congratulations!<br> We are selected you to interview for the <b> $job_title </b> position in Prep Excellence.</p>
            ";
            $this->defaultEmail($applicant->name, $applicant->email, $subject,$message);
        }else if($status == 3){
            $subject='Select';
            $message="
            <p>Congratulations!<br> You are selected for the <b> $job_title </b> position in Prep Excellence.</p>
            ";
            $this->defaultEmail($applicant->name, $applicant->email, $subject,$message);
        }else if($status == 4){
            $subject='Cancelled';
            $message="
            <p>We are sorry to say that you are not selected for the <b> $job_title </b> position in Prep Excellence.</p>
            ";
            $this->defaultEmail($applicant->name, $applicant->email, $subject,$message);
        }

        return response()->json(['status'=>'success','message'=>'Successfully updated'],200);
    }
    public function export(Request $request)
    {
        $cols = ['job.title','name', 'email', 'phone_number','image','referral','subjects', 'available','available_hour'];
        $headers = ['Job','name', 'email', 'phone number','image','referral','subjects', 'available','available_hour'];
        return $this->commonDataExporter('Applicant', $cols, $headers);
    }
}
