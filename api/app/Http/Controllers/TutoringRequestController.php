<?php

namespace App\Http\Controllers;

use App\Http\Requests\TutoringRequestStoreRequest;
use App\Http\Requests\TutoringRequestUpdateRequest;
use App\Http\Resources\TutoringRequestCollection;
use App\Http\Resources\TutoringRequestResource;
use App\Models\TutoringRequest;
use Illuminate\Http\Request;

class TutoringRequestController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\TutoringRequestCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $contacts = TutoringRequest::query();
        if ($search) {
            $contacts->whereLike(['name','email','phone_number'], $search);
        }
        return new TutoringRequestCollection($contacts->orderBy('id','DESC')->paginate($itemsPerPage));
    }

    /**
     * @param \App\Http\Requests\TutoringRequestStoreRequest $request
     * @return \App\Http\Resources\TutoringRequestResource
     */
    public function store(TutoringRequestStoreRequest $request)
    {
        $tutoringRequest = TutoringRequest::create($request->validated());

        return new TutoringRequestResource($tutoringRequest);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\TutoringRequest $tutoringRequest
     * @return \App\Http\Resources\TutoringRequestResource
     */
    public function show(Request $request, TutoringRequest $tutoringRequest)
    {
        return new TutoringRequestResource($tutoringRequest);
    }

    /**
     * @param \App\Http\Requests\TutoringRequestUpdateRequest $request
     * @param \App\Models\TutoringRequest $tutoringRequest
     * @return \App\Http\Resources\TutoringRequestResource
     */
    public function update(TutoringRequestUpdateRequest $request, TutoringRequest $tutoringRequest)
    {
        $tutoringRequest->update($request->validated());

        return new TutoringRequestResource($tutoringRequest);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\TutoringRequest $tutoringRequest
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, TutoringRequest $tutoringRequest)
    {
        $tutoringRequest->delete();

        return response()->noContent();
    }
}
