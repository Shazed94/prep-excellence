<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Http\Requests\BlogCommentStoreRequest;
use App\Http\Requests\StoreContactUsRequest;
use App\Http\Requests\StoreContactUsRequest2;
use App\Mail\DefaultMail;
use App\Models\BlogComment;
use App\Models\ContactUs;
use App\Traits\CommonTrait;
use Illuminate\Support\Facades\Mail;

class BlogCommentController extends Controller
{
    use CommonTrait;

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\BlogCommentStoreRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(BlogCommentStoreRequest $request)
    {
        $data = $request->validated();
        $data += $this->storeMetadata($request);
        BlogComment::create($data);
        return response()->json(['status' => 'success', 'message' => 'Thank you for your comment'], 200);
    }
}
