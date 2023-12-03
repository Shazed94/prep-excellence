<?php

namespace App\Http\Controllers;

use App\Http\Requests\SiblingStoreRequest;
use App\Http\Requests\SiblingUpdateRequest;
use App\Http\Resources\SiblingCollection;
use App\Http\Resources\SiblingResource;
use App\Models\Sibling;
use Illuminate\Http\Request;

class SiblingController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\SiblingCollection
     */
    public function index(Request $request)
    {
        $siblings = Sibling::all();

        return new SiblingCollection($siblings);
    }

    /**
     * @param \App\Http\Requests\SiblingStoreRequest $request
     * @return \App\Http\Resources\SiblingResource
     */
    public function store(SiblingStoreRequest $request)
    {
        $sibling = Sibling::create($request->validated());

        return new SiblingResource($sibling);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Sibling $sibling
     * @return \App\Http\Resources\SiblingResource
     */
    public function show(Request $request, Sibling $sibling)
    {
        return new SiblingResource($sibling);
    }

    /**
     * @param \App\Http\Requests\SiblingUpdateRequest $request
     * @param \App\Models\Sibling $sibling
     * @return \App\Http\Resources\SiblingResource
     */
    public function update(SiblingUpdateRequest $request, Sibling $sibling)
    {
        $sibling->update($request->validated());

        return new SiblingResource($sibling);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Sibling $sibling
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, Sibling $sibling)
    {
        $sibling->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }
}
