<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\CourseReview;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\CourseReviewController
 */
class CourseReviewControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $courseReviews = CourseReview::factory()->count(3)->create();

        $response = $this->get(route('course-review.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CourseReviewController::class,
            'store',
            \App\Http\Requests\CourseReviewStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $is_active = $this->faker->boolean;

        $response = $this->post(route('course-review.store'), [
            'is_active' => $is_active,
        ]);

        $courseReviews = CourseReview::query()
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $courseReviews);
        $courseReview = $courseReviews->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $courseReview = CourseReview::factory()->create();

        $response = $this->get(route('course-review.show', $courseReview));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CourseReviewController::class,
            'update',
            \App\Http\Requests\CourseReviewUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $courseReview = CourseReview::factory()->create();
        $is_active = $this->faker->boolean;

        $response = $this->put(route('course-review.update', $courseReview), [
            'is_active' => $is_active,
        ]);

        $courseReview->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($is_active, $courseReview->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $courseReview = CourseReview::factory()->create();

        $response = $this->delete(route('course-review.destroy', $courseReview));

        $response->assertNoContent();

        $this->assertSoftDeleted($courseReview);
    }
}
