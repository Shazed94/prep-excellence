<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreChatUserRequest;
use App\Http\Requests\UpdateChatUserRequest;
use App\Http\Resources\UserCollection;
use App\Models\ChatUser;
use App\Models\User;
use Illuminate\Http\Request;
class ChatUserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;

        $chat_users = ChatUser::where('sender_id',auth()->id())->orWhere('receiver_id',auth()->id());
        $c_1 = $chat_users->pluck('sender_id')->toArray();
        $c_2 = $chat_users->pluck('receiver_id')->toArray();
        $user_ids = array_merge($c_1,$c_2);
        $users = User::query();
        $users->where('id', '!=', auth()->id())
            ->whereIn('id',$user_ids);
        if($search){
            //$users->whereLike(['first_name','last_name'],$search);
            $users->whereRaw("concat(first_name, ' ', last_name) like '%" .$search. "%' ");
        }
        $users = $users->withCount([
            'receiveMessagesUnseen'=>function($q){
                $q->where('receiver_id',auth()->id());
            }
        ])->orderBy('receive_messages_unseen_count','DESC')
            ->get([
                'userable_type',
                'userable_id',
                'first_name',
                'last_name',
                'name',
                'email',
                'phone_number','image']);
        return response()->json(['data'=>$users],200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreChatUserRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreChatUserRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ChatUser  $chatUser
     * @return \Illuminate\Http\Response
     */
    public function show(ChatUser $chatUser)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateChatUserRequest  $request
     * @param  \App\Models\ChatUser  $chatUser
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateChatUserRequest $request, ChatUser $chatUser)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ChatUser  $chatUser
     * @return \Illuminate\Http\Response
     */
    public function destroy(ChatUser $chatUser)
    {
        //
    }
}
