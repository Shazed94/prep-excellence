<?php

namespace App\Http\Controllers;

use App\Http\Requests\BlogCommentStoreRequest;
use App\Http\Requests\BlogCommentUpdateRequest;
use App\Http\Resources\BlogCommentCollection;
use App\Http\Resources\BlogCommentResource;
use App\Models\BlogComment;
use Illuminate\Http\Request;

class BlogCommentController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\BlogCommentCollection
     */
    public function index(Request $request)
    {
        $blogComments = BlogComment::all();

        return new BlogCommentCollection($blogComments);
    }

    /**
     * @param \App\Http\Requests\BlogCommentStoreRequest $request
     * @return \App\Http\Resources\BlogCommentResource
     */
    public function store(BlogCommentStoreRequest $request)
    {
        $blogComment = BlogComment::create($request->validated());

        return new BlogCommentResource($blogComment);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\BlogComment $blogComment
     * @return \App\Http\Resources\BlogCommentResource
     */
    public function show(Request $request, BlogComment $blogComment)
    {
        return new BlogCommentResource($blogComment);
    }

    /**
     * @param \App\Http\Requests\BlogCommentUpdateRequest $request
     * @param \App\Models\BlogComment $blogComment
     * @return \App\Http\Resources\BlogCommentResource
     */
    public function update(BlogCommentUpdateRequest $request, BlogComment $blogComment)
    {
        $blogComment->update($request->validated());

        return new BlogCommentResource($blogComment);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\BlogComment $blogComment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, BlogComment $blogComment)
    {
        $blogComment->delete();

        return response()->noContent();
    }

    public function statusChange(BlogComment $blogComment, $status)
    {
        $blogComment->update(['status'=>$status]);
        return response()->json(['status'=>'success','message'=>"status change successfully"],200);
    }
}
