<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactUsRequest;
use App\Http\Requests\StoreContactUsRequest2;
use App\Mail\DefaultMail;
use App\Models\ContactUs;
use App\Traits\CommonTrait;
use Illuminate\Support\Facades\Mail;

class ContactUsController extends Controller
{
    use CommonTrait;

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\StoreContactUsRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreContactUsRequest $request)
    {
        $data = $request->validated();
        $data += $this->storeMetadata($request);
        $cn = ContactUs::create($data);
        if (isset($cn->id)) {
            try {
                $dd=[
                    'subject'=>"Email from contact us",
                    'name'=>"Admin",
                    'content'=>"<p>Email:". $data['email']."</p><p> Message: ". $data['message'] ."</p>",
                ];
                Mail::to(env('ADMIN_NOTIFY_MAIL'))->send(new DefaultMail($dd));

            }catch (\Exception $e){

            }
            return response()->json(['status' => 'success', 'message' => 'Thank you for contacting with us'], 200);
        }
        else return response()->json(['status' => 'error', 'message' => 'Invalid request try again'], 404);
    }

    public function store2(StoreContactUsRequest2 $request)
    {
        $data = $request->validated();
        $data += $this->storeMetadata($request);
        $cn = ContactUs::create($data);
        if (isset($cn->id)) {
            try {
                $dd=[
                    'subject'=>"Email from contact us",
                    'name'=>"Admin",
                    'content'=>"<p>Email:". $data['email']."</p><p>Subject:". $data['subject']."</p><p> Message: ". $data['message'] ."</p>",
                ];
                Mail::to(env('ADMIN_NOTIFY_MAIL'))->send(new DefaultMail($dd));

            }catch (\Exception $e){

            }
            return response()->json(['status' => 'success', 'message' => 'Thank you for contacting with us'], 200);
        }
        else return response()->json(['status' => 'error', 'message' => 'Invalid request try again'], 404);
    }
}
