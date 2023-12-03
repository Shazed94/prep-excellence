<?php

namespace App\Http\Controllers;

use App\Http\Requests\CourseRatingStoreRequest;
use App\Http\Requests\CourseRatingUpdateRequest;
use App\Http\Resources\CourseRatingCollection;
use App\Http\Resources\CourseRatingResource;
use App\Models\CourseRating;
use Illuminate\Http\Request;

class CourseRatingController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\CourseRatingCollection
     */
    public function index(Request $request)
    {
        $courseRatings = CourseRating::all();

        return new CourseRatingCollection($courseRatings);
    }

    /**
     * @param \App\Http\Requests\CourseRatingStoreRequest $request
     * @return \App\Http\Resources\CourseRatingResource
     */
    public function store(CourseRatingStoreRequest $request)
    {
        $courseRating = CourseRating::create($request->validated());

        return new CourseRatingResource($courseRating);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\CourseRating $courseRating
     * @return \App\Http\Resources\CourseRatingResource
     */
    public function show(Request $request, CourseRating $courseRating)
    {
        return new CourseRatingResource($courseRating);
    }

    /**
     * @param \App\Http\Requests\CourseRatingUpdateRequest $request
     * @param \App\Models\CourseRating $courseRating
     * @return \App\Http\Resources\CourseRatingResource
     */
    public function update(CourseRatingUpdateRequest $request, CourseRating $courseRating)
    {
        $courseRating->update($request->validated());

        return new CourseRatingResource($courseRating);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\CourseRating $courseRating
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, CourseRating $courseRating)
    {
        $courseRating->delete();

        return response()->noContent();
    }
}
