<?php

namespace App\Http\Controllers;

use App\Http\Requests\StudentAnswerStoreRequest;
use App\Http\Requests\StudentAnswerUpdateRequest;
use App\Http\Resources\StudentAnswerCollection;
use App\Http\Resources\StudentAnswerResource;
use App\Models\StudentAnswer;
use Illuminate\Http\Request;

class StudentAnswerController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\StudentAnswerCollection
     */
    public function index(Request $request)
    {
        $studentAnswers = StudentAnswer::all();

        return new StudentAnswerCollection($studentAnswers);
    }

    /**
     * @param \App\Http\Requests\StudentAnswerStoreRequest $request
     * @return \App\Http\Resources\StudentAnswerResource
     */
    public function store(StudentAnswerStoreRequest $request)
    {
        $studentAnswer = StudentAnswer::create($request->validated());

        return new StudentAnswerResource($studentAnswer);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\StudentAnswer $studentAnswer
     * @return \App\Http\Resources\StudentAnswerResource
     */
    public function show(Request $request, StudentAnswer $studentAnswer)
    {
        return new StudentAnswerResource($studentAnswer);
    }

    /**
     * @param \App\Http\Requests\StudentAnswerUpdateRequest $request
     * @param \App\Models\StudentAnswer $studentAnswer
     * @return \App\Http\Resources\StudentAnswerResource
     */
    public function update(StudentAnswerUpdateRequest $request, StudentAnswer $studentAnswer)
    {
        $studentAnswer->update($request->validated());

        return new StudentAnswerResource($studentAnswer);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\StudentAnswer $studentAnswer
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, StudentAnswer $studentAnswer)
    {
        $studentAnswer->delete();

        return response()->noContent();
    }
}
