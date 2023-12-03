<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChatFileStoreRequest;
use App\Http\Requests\ChatFileUpdateRequest;
use App\Http\Resources\ChatFileCollection;
use App\Http\Resources\ChatFileResource;
use App\Models\ChatFile;
use Illuminate\Http\Request;

class ChatFileController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\ChatFileCollection
     */
    public function index(Request $request)
    {
        $chatFiles = ChatFile::all();

        return new ChatFileCollection($chatFiles);
    }

    /**
     * @param \App\Http\Requests\ChatFileStoreRequest $request
     * @return \App\Http\Resources\ChatFileResource
     */
    public function store(ChatFileStoreRequest $request)
    {
        $chatFile = ChatFile::create($request->validated());

        return new ChatFileResource($chatFile);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ChatFile $chatFile
     * @return \App\Http\Resources\ChatFileResource
     */
    public function show(Request $request, ChatFile $chatFile)
    {
        return new ChatFileResource($chatFile);
    }

    /**
     * @param \App\Http\Requests\ChatFileUpdateRequest $request
     * @param \App\Models\ChatFile $chatFile
     * @return \App\Http\Resources\ChatFileResource
     */
    public function update(ChatFileUpdateRequest $request, ChatFile $chatFile)
    {
        $chatFile->update($request->validated());

        return new ChatFileResource($chatFile);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ChatFile $chatFile
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, ChatFile $chatFile)
    {
        $chatFile->delete();

        return response()->noContent();
    }
}
