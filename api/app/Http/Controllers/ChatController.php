<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChatStoreRequest;
use App\Http\Requests\ChatUpdateRequest;
use App\Http\Resources\ChatCollection;
use App\Http\Resources\ChatResource;
use App\Models\Chat;
use App\Models\User;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\ChatCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 10;
        $search = request('search');
        $chats = Chat::query();
        if ($search) {
            $chats->whereLike(['message'], $search);
        }
        return new ChatCollection($chats->paginate($itemsPerPage));
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\ChatCollection
     *
     * get user wise own chat
     */
    public function index2(Request $request, User $user){
        $itemsPerPage = request('per_page') ?? 10;
        $chats = Chat::query();
        $chats->where(function ($q) use ($user) {
            $q->where('sender_id',auth()->id())->orWhere('receiver_id',auth()->id());
        });
        $chats->where(function ($q) use ($user) {
            $q->where('sender_id',$user->id)->orWhere('receiver_id',$user->id);
        });
        return new ChatCollection($chats->latest()->paginate($itemsPerPage));
    }

    /**
     * @param \App\Http\Requests\ChatStoreRequest $request
     * @return \App\Http\Resources\ChatResource
     */
    public function store(ChatStoreRequest $request)
    {
        $data = $request->validated();
        $data +=[
            'sender_id'=>auth()->id(),
        ];
        $chat = Chat::create($data);

        return new ChatResource($chat);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Chat $chat
     * @return \App\Http\Resources\ChatResource
     */
    public function show(Request $request, Chat $chat)
    {
        return new ChatResource($chat);
    }

    /**
     * @param \App\Http\Requests\ChatUpdateRequest $request
     * @param \App\Models\Chat $chat
     * @return \App\Http\Resources\ChatResource
     */
    public function update(ChatUpdateRequest $request, Chat $chat)
    {
        $chat->update($request->validated());

        return new ChatResource($chat);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Chat $chat
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Chat $chat)
    {
        $chat->delete();

        return response()->noContent();
    }

    public function makeSeenMessage(Request $request, $sender_id)
    {
        Chat::where(['receiver_id'=>auth()->id(),'sender_id'=>$sender_id])->update(['is_seen'=>1]);
        return response()->json(['status'=>'success','message'=>'Successfully updated'],200);
    }
}
