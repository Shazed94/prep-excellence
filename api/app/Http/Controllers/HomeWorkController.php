<?php

namespace App\Http\Controllers;

use App\Http\Requests\HomeWorkStoreRequest;
use App\Http\Requests\HomeWorkUpdateRequest;
use App\Http\Resources\HomeWorkCollection;
use App\Http\Resources\HomeWorkResource;
use App\Models\HomeWork;
use Illuminate\Http\Request;

class HomeWorkController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\HomeWorkCollection
     */
    public function index(Request $request)
    {
        $homeWork = HomeWork::all();

        return new HomeWorkCollection($homeWork);
    }

    /**
     * @param \App\Http\Requests\HomeWorkStoreRequest $request
     * @return \App\Http\Resources\HomeWorkResource
     */
    public function store(HomeWorkStoreRequest $request)
    {
        $homeWork = HomeWork::create($request->validated());

        return new HomeWorkResource($homeWork);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\HomeWork $homeWork
     * @return \App\Http\Resources\HomeWorkResource
     */
    public function show(Request $request, HomeWork $homeWork)
    {
        return new HomeWorkResource($homeWork);
    }

    /**
     * @param \App\Http\Requests\HomeWorkUpdateRequest $request
     * @param \App\Models\HomeWork $homeWork
     * @return \App\Http\Resources\HomeWorkResource
     */
    public function update(HomeWorkUpdateRequest $request, HomeWork $homeWork)
    {
        $homeWork->update($request->validated());

        return new HomeWorkResource($homeWork);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\HomeWork $homeWork
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, HomeWork $homeWork)
    {
        $homeWork->delete();

        return response()->noContent();
    }
}
