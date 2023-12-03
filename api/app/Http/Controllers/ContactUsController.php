<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactUsRequest;
use App\Http\Requests\UpdateContactUsRequest;
use App\Http\Resources\ContactUsCollection;
use App\Models\ContactUs;
use App\Traits\CommonTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\Request;

class ContactUsController extends Controller
{
    use CommonTrait,ReportTrait;
    /**
     * Display a listing of the resource.
     *
     * @return ContactUsCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $contacts = ContactUs::query();
        if ($search) {
            $contacts->whereLike(['first_name','last_name','email','phone_number','message','subject'], $search);
        }
        return new ContactUsCollection($contacts->orderBy('id','DESC')->paginate($itemsPerPage));
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreContactUsRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreContactUsRequest $request)
    {
        $data = $request->validated();
        $data += $this->storeMetadata();
        $cn = ContactUs::create($data);
        if (isset($cn->id)) return response()->json(['status'=>'success','message'=>'Thank you for contacting with us'],200);
        else return response()->json(['status'=>'error','message'=>'Invalid request try again'],404);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ContactUs  $contactUs
     * @return \Illuminate\Http\Response
     */
    public function show(ContactUs $contactUs)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateContactUsRequest  $request
     * @param  \App\Models\ContactUs  $contactUs
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateContactUsRequest $request, ContactUs $contactUs)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ContactUs  $contactUs
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, ContactUs $contactUs)
    {
        //return $contactUs;
        $contactUs->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);

    }
    public function export(Request $request)
    {
        $cols = ['name','email','phone_number','subject','state_or_region','country','student_grade','course','message','created_at'];
        $headers = ['Name','email', 'phone_number','subject','state_or_region','country','student_grade','course','message','Date'];
        return $this->commonDataExporter('ContactUs', $cols, $headers);

    }
}
