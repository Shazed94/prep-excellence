<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\CourseRating;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\CourseRatingController
 */
class CourseRatingControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $courseRatings = CourseRating::factory()->count(3)->create();

        $response = $this->get(route('course-rating.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CourseRatingController::class,
            'store',
            \App\Http\Requests\CourseRatingStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $rating = $this->faker->randomFloat(/** double_attributes **/);
        $is_active = $this->faker->boolean;

        $response = $this->post(route('course-rating.store'), [
            'rating' => $rating,
            'is_active' => $is_active,
        ]);

        $courseRatings = CourseRating::query()
            ->where('rating', $rating)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $courseRatings);
        $courseRating = $courseRatings->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $courseRating = CourseRating::factory()->create();

        $response = $this->get(route('course-rating.show', $courseRating));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CourseRatingController::class,
            'update',
            \App\Http\Requests\CourseRatingUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $courseRating = CourseRating::factory()->create();
        $rating = $this->faker->randomFloat(/** double_attributes **/);
        $is_active = $this->faker->boolean;

        $response = $this->put(route('course-rating.update', $courseRating), [
            'rating' => $rating,
            'is_active' => $is_active,
        ]);

        $courseRating->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($rating, $courseRating->rating);
        $this->assertEquals($is_active, $courseRating->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $courseRating = CourseRating::factory()->create();

        $response = $this->delete(route('course-rating.destroy', $courseRating));

        $response->assertNoContent();

        $this->assertSoftDeleted($courseRating);
    }
}
