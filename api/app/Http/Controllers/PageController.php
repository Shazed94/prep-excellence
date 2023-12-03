<?php

namespace App\Http\Controllers;

use App\Http\Requests\PageStoreRequest;
use App\Http\Requests\PageUpdateRequest;
use App\Http\Resources\PageCollection;
use App\Http\Resources\PageResource;
use App\Models\Page;
use App\Traits\FileUploadTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PageController extends Controller
{
    use FileUploadTrait,ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\PageCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $pages = Page::query();
        if ($search) {
            $pages->whereLike(['title','description'], $search);
        }

        return new PageCollection($pages->paginate($itemsPerPage));
    }

    /**
     * @param \App\Http\Requests\PageStoreRequest $request
     * @return \App\Http\Resources\PageResource
     */
    public function store(PageStoreRequest $request)
    {
        $data = $request->validated();
        unset($data['image']);
        unset($data['bread_crumb_image']);
        if ($request->file('image')){
            $img = $this->uploadPhoto($request->file('image'),'page/');
            $data +=[
                'image'=>$img,
            ];
        }
        if ($request->file('bread_crumb_image')){
            $img2 = $this->uploadPhoto($request->file('bread_crumb_image'),'page/',['w'=>'1280','h'=>'500']);
            $data +=[
                'bread_crumb_image'=>$img2,
            ];
        }
        $slug = Str::slug($request->title);
        $chk = Page::withTrashed()->where('slug',$slug)->first();
        if (isset($chk->id)){
            $vv = 1;
            while (1){
                $temp_slug = $slug.'-'.$vv;
                $check_slug = Page::withTrashed()->where('slug',$slug)->first();
                if(!isset($check_slug->id)) break;
                else{
                    $vv = $vv + 1;
                }
            }
            $slug = $temp_slug;
        }
        $data +=[
            'slug'=>$slug,
            'status'=>1,
        ];
        $page = Page::create($data);

        return new PageResource($page);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Page $page
     * @return \App\Http\Resources\PageResource
     */
    public function show(Request $request, Page $page)
    {
        return new PageResource($page);
    }

    /**
     * @param \App\Http\Requests\PageUpdateRequest $request
     * @param \App\Models\Page $page
     * @return \App\Http\Resources\PageResource
     */
    public function update(PageUpdateRequest $request, Page $page)
    {
        $data = $request->validated();
        unset($data['image']);
        unset($data['bread_crumb_image']);
        if ($request->file('image')){
            $img = $this->uploadPhoto($request->file('image'),'page/');
            $data +=[
                'image'=>$img,
            ];
        }
        if ($request->file('bread_crumb_image')){
            $img2 = $this->uploadPhoto($request->file('bread_crumb_image'),'page/',['w'=>'1280','h'=>'500']);
            $data +=[
                'bread_crumb_image'=>$img2,
            ];
        }
        $slug = Str::slug($request->title);
        $chk = Page::withTrashed()->where('slug',$slug)->where('id','!=',$page->id)->first();
        if (isset($chk->id)){
            $vv = 1;
            while (1){
                $temp_slug = $slug.'-'.$vv;
                $check_slug = Page::withTrashed()->where('slug',$slug)->where('id','!=',$page->id)->first();
                if(!isset($check_slug->id)) break;
                else{
                    $vv = $vv + 1;
                }
            }
            $slug = $temp_slug;
        }
        unset($data['slug']);
        $data +=[
            'slug'=>$slug
        ];
        $page->update($data);

        return new PageResource($page);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Page $page
     * @return JsonResponse
     */
    public function destroy(Request $request, Page $page)
    {
        $page->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(Page $page): JsonResponse
    {
        try {
            $page->update(['status' => !$page->status]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }

    public function export(Request $request)
    {
        $cols = ['title', 'short_description','image','template','position'];
        $headers = ['title', 'short_description','image', 'template','position'];
        $total=[];
        $where=[];
        $template='exporter.commonTablePdf2';
        return $this->commonDataExporter('Page', $cols, $headers,$total,$where,$template);

    }
}
