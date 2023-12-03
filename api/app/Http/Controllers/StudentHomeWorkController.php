<?php

namespace App\Http\Controllers;

use App\Http\Requests\StudentHomeWorkStoreRequest;
use App\Http\Requests\StudentHomeWorkUpdateRequest;
use App\Http\Resources\StudentHomeWorkCollection;
use App\Http\Resources\StudentHomeWorkResource;
use App\Models\StudentHomeWork;
use Illuminate\Http\Request;

class StudentHomeWorkController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\StudentHomeWorkCollection
     */
    public function index(Request $request)
    {
        $studentHomeWorks = StudentHomeWork::all();

        return new StudentHomeWorkCollection($studentHomeWorks);
    }

    /**
     * @param \App\Http\Requests\StudentHomeWorkStoreRequest $request
     * @return \App\Http\Resources\StudentHomeWorkResource
     */
    public function store(StudentHomeWorkStoreRequest $request)
    {
        $studentHomeWork = StudentHomeWork::create($request->validated());

        return new StudentHomeWorkResource($studentHomeWork);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\StudentHomeWork $studentHomeWork
     * @return \App\Http\Resources\StudentHomeWorkResource
     */
    public function show(Request $request, StudentHomeWork $studentHomeWork)
    {
        return new StudentHomeWorkResource($studentHomeWork);
    }

    /**
     * @param \App\Http\Requests\StudentHomeWorkUpdateRequest $request
     * @param \App\Models\StudentHomeWork $studentHomeWork
     * @return \App\Http\Resources\StudentHomeWorkResource
     */
    public function update(StudentHomeWorkUpdateRequest $request, StudentHomeWork $studentHomeWork)
    {
        $studentHomeWork->update($request->validated());

        return new StudentHomeWorkResource($studentHomeWork);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\StudentHomeWork $studentHomeWork
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, StudentHomeWork $studentHomeWork)
    {
        $studentHomeWork->delete();

        return response()->noContent();
    }
}
