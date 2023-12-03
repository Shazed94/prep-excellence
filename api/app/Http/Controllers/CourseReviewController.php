<?php

namespace App\Http\Controllers;

use App\Http\Requests\CourseReviewStoreRequest;
use App\Http\Requests\CourseReviewUpdateRequest;
use App\Http\Resources\CourseReviewCollection;
use App\Http\Resources\CourseReviewResource;
use App\Models\CourseReview;
use Illuminate\Http\Request;

class CourseReviewController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\CourseReviewCollection
     */
    public function index(Request $request)
    {
        $courseReviews = CourseReview::all();

        return new CourseReviewCollection($courseReviews);
    }

    /**
     * @param \App\Http\Requests\CourseReviewStoreRequest $request
     * @return \App\Http\Resources\CourseReviewResource
     */
    public function store(CourseReviewStoreRequest $request)
    {
        $courseReview = CourseReview::create($request->validated());

        return new CourseReviewResource($courseReview);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\CourseReview $courseReview
     * @return \App\Http\Resources\CourseReviewResource
     */
    public function show(Request $request, CourseReview $courseReview)
    {
        return new CourseReviewResource($courseReview);
    }

    /**
     * @param \App\Http\Requests\CourseReviewUpdateRequest $request
     * @param \App\Models\CourseReview $courseReview
     * @return \App\Http\Resources\CourseReviewResource
     */
    public function update(CourseReviewUpdateRequest $request, CourseReview $courseReview)
    {
        $courseReview->update($request->validated());

        return new CourseReviewResource($courseReview);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\CourseReview $courseReview
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, CourseReview $courseReview)
    {
        $courseReview->delete();

        return response()->noContent();
    }
}
