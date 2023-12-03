<?php

namespace App\Http\Controllers;

use App\Http\Requests\BlogStoreRequest;
use App\Http\Requests\BlogUpdateRequest;
use App\Http\Resources\BlogCollection;
use App\Http\Resources\BlogResource;
use App\Models\Blog;
use App\Traits\FileUploadTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    use FileUploadTrait,ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\BlogCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $blogs = Blog::query();
        if ($search) {
            $blogs->whereLike(['title','description'], $search);
        }
        $blogs = $blogs->with(['user','category','blogComments'])->orderBy('id','DESC')->paginate($itemsPerPage);

        return new BlogCollection($blogs);
    }

    /**
     * @param \App\Http\Requests\BlogStoreRequest $request
     * @return \App\Http\Resources\BlogResource
     */
    public function store(BlogStoreRequest $request)
    {
        $data = $request->validated();
        unset($data['image']);
        unset($data['video']);
        if ($request->type==1){
            if ($request->file('image')){
                $img = $this->uploadPhoto2($request->file('image'),'blog/',['w'=>1280,'h'=>1200]);
                $data +=[
                    'image'=>$img,
                ];
            }
        }elseif ($request->type==2){
            if ($request->file('video')){
                $video = $this->videoUpload($request->file('video'),'page/video');
                $data +=[
                    'video'=>$video,
                ];
            }
        }

        $data +=[
            //'slug'=>Str::slug($request->title).'-'.rand(11111,999999999),
            'status'=>1,
        ];
        $blog = Blog::create($data);

        return new BlogResource($blog);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Blog $blog
     * @return \App\Http\Resources\BlogResource
     */
    public function show(Request $request, Blog $blog)
    {
        return new BlogResource($blog);
    }

    /**
     * @param \App\Http\Requests\BlogUpdateRequest $request
     * @param \App\Models\Blog $blog
     * @return \App\Http\Resources\BlogResource
     */
    public function update(BlogUpdateRequest $request, Blog $blog)
    {
        $data = $request->validated();
        unset($data['image']);
        unset($data['video']);
        if ($request->type==1){
            if ($request->file('image')){
                $img = $this->uploadPhoto2($request->file('image'),'blog/',['w'=>1280,'h'=>1200]);
                $data +=[
                    'image'=>$img,
                ];
            }
        }elseif ($request->type==2){
            if ($request->file('video')){
                $video = $this->videoUpload($request->file('video'),'page/video');
                $data +=[
                    'video'=>$video,
                ];
            }
        }
        $blog->update($data);

        return new BlogResource($blog);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Blog $blog
     * @return JsonResponse
     */
    public function destroy(Request $request, Blog $blog)
    {
        $blog->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(Blog $blog): JsonResponse
    {
        try {
            $blog->update(['status' => !$blog->status]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }

    public function export(Request $request)
    {
        $cols = ['title','short_description','type','position'];
        $headers = [ 'title','short_description', 'type','position'];
        $total=[];
        $where=[];
        $template='exporter.commonTablePdf2';
        return $this->commonDataExporter('Blog', $cols, $headers,$total,$where,$template);

    }
}
