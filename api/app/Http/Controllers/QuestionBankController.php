<?php

namespace App\Http\Controllers;

use App\Http\Requests\QuestionBankStoreRequest;
use App\Http\Requests\QuestionBankUpdateRequest;
use App\Http\Resources\QuestionBankCollection;
use App\Http\Resources\QuestionBankResource;
use App\Models\QuestionBank;
use Illuminate\Http\Request;

class QuestionBankController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\QuestionBankCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $questionBanks = QuestionBank::query();
        /*if ($search) {
            $exams->whereLike(['title','description'], $search);
        }*/

        return new QuestionBankCollection($questionBanks->paginate($itemsPerPage));
    }

    /**
     * @param \App\Http\Requests\QuestionBankStoreRequest $request
     * @return \App\Http\Resources\QuestionBankResource
     */
    public function store(QuestionBankStoreRequest $request)
    {
        $questionBank = QuestionBank::create($request->validated());

        return new QuestionBankResource($questionBank);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\QuestionBank $questionBank
     * @return \App\Http\Resources\QuestionBankResource
     */
    public function show(Request $request, QuestionBank $questionBank)
    {
        return new QuestionBankResource($questionBank);
    }

    /**
     * @param \App\Http\Requests\QuestionBankUpdateRequest $request
     * @param \App\Models\QuestionBank $questionBank
     * @return \App\Http\Resources\QuestionBankResource
     */
    public function update(QuestionBankUpdateRequest $request, QuestionBank $questionBank)
    {
        $questionBank->update($request->validated());

        return new QuestionBankResource($questionBank);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\QuestionBank $questionBank
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, QuestionBank $questionBank)
    {
        $questionBank->delete();

        return response()->noContent();
    }
}
