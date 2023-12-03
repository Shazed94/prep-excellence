<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChatGroupStoreRequest;
use App\Http\Requests\ChatGroupUpdateRequest;
use App\Http\Resources\ChatGroupCollection;
use App\Http\Resources\ChatGroupResource;
use App\Models\ChatGroup;
use Illuminate\Http\Request;

class ChatGroupController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\ChatGroupCollection
     */
    public function index(Request $request)
    {
        $chatGroups = ChatGroup::all();

        return new ChatGroupCollection($chatGroups);
    }

    /**
     * @param \App\Http\Requests\ChatGroupStoreRequest $request
     * @return \App\Http\Resources\ChatGroupResource
     */
    public function store(ChatGroupStoreRequest $request)
    {
        $chatGroup = ChatGroup::create($request->validated());

        return new ChatGroupResource($chatGroup);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ChatGroup $chatGroup
     * @return \App\Http\Resources\ChatGroupResource
     */
    public function show(Request $request, ChatGroup $chatGroup)
    {
        return new ChatGroupResource($chatGroup);
    }

    /**
     * @param \App\Http\Requests\ChatGroupUpdateRequest $request
     * @param \App\Models\ChatGroup $chatGroup
     * @return \App\Http\Resources\ChatGroupResource
     */
    public function update(ChatGroupUpdateRequest $request, ChatGroup $chatGroup)
    {
        $chatGroup->update($request->validated());

        return new ChatGroupResource($chatGroup);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ChatGroup $chatGroup
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, ChatGroup $chatGroup)
    {
        $chatGroup->delete();

        return response()->noContent();
    }
}
