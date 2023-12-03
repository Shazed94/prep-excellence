<?php

namespace App\Http\Controllers;

use App\Http\Requests\FaqStoreRequest;
use App\Http\Requests\FaqUpdateRequest;
use App\Http\Resources\FaqCollection;
use App\Http\Resources\FaqResource;
use App\Models\Faq;
use App\Traits\ReportTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    use ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\FaqCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $faqs = Faq::query();
        if ($search) {
            $faqs->whereLike(['question','answer'], $search);
        }

        return new FaqCollection($faqs->paginate($itemsPerPage));
    }

    /**
     * @param \App\Http\Requests\FaqStoreRequest $request
     * @return \App\Http\Resources\FaqResource
     */
    public function store(FaqStoreRequest $request)
    {
        $faq = Faq::create($request->validated());

        return new FaqResource($faq);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Faq $faq
     * @return \App\Http\Resources\FaqResource
     */
    public function show(Request $request, Faq $faq)
    {
        return new FaqResource($faq);
    }

    /**
     * @param \App\Http\Requests\FaqUpdateRequest $request
     * @param \App\Models\Faq $faq
     * @return \App\Http\Resources\FaqResource
     */
    public function update(FaqUpdateRequest $request, Faq $faq)
    {
        $faq->update($request->validated());

        return new FaqResource($faq);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Faq $faq
     * @return JsonResponse
     */
    public function destroy(Request $request, Faq $faq)
    {
        $faq->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(Faq $faq): JsonResponse
    {
        try {
            $faq->update(['status' => !$faq->status]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
    public function export(Request $request)
    {
        $cols = ['question', 'answer','status','created_at'];
        $headers = ['question', 'answer','status','Date'];
        $total=[];
        $where=[];
        $template='exporter.commonTablePdf2';
        return $this->commonDataExporter('Faq', $cols, $headers,$total,$where,$template);

    }
}
