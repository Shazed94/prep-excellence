<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Course;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\CourseController
 */
class CourseControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $courses = Course::factory()->count(3)->create();

        $response = $this->get(route('course.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CourseController::class,
            'store',
            \App\Http\Requests\CourseStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $amount = $this->faker->randomFloat(/** double_attributes **/);
        $duration_in_hour = $this->faker->randomFloat(/** double_attributes **/);
        $duration_in_week = $this->faker->numberBetween(-10000, 10000);
        $position = $this->faker->numberBetween(-10000, 10000);
        $is_active = $this->faker->boolean;

        $response = $this->post(route('course.store'), [
            'amount' => $amount,
            'duration_in_hour' => $duration_in_hour,
            'duration_in_week' => $duration_in_week,
            'position' => $position,
            'is_active' => $is_active,
        ]);

        $courses = Course::query()
            ->where('amount', $amount)
            ->where('duration_in_hour', $duration_in_hour)
            ->where('duration_in_week', $duration_in_week)
            ->where('position', $position)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $courses);
        $course = $courses->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $course = Course::factory()->create();

        $response = $this->get(route('course.show', $course));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CourseController::class,
            'update',
            \App\Http\Requests\CourseUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $course = Course::factory()->create();
        $amount = $this->faker->randomFloat(/** double_attributes **/);
        $duration_in_hour = $this->faker->randomFloat(/** double_attributes **/);
        $duration_in_week = $this->faker->numberBetween(-10000, 10000);
        $position = $this->faker->numberBetween(-10000, 10000);
        $is_active = $this->faker->boolean;

        $response = $this->put(route('course.update', $course), [
            'amount' => $amount,
            'duration_in_hour' => $duration_in_hour,
            'duration_in_week' => $duration_in_week,
            'position' => $position,
            'is_active' => $is_active,
        ]);

        $course->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($amount, $course->amount);
        $this->assertEquals($duration_in_hour, $course->duration_in_hour);
        $this->assertEquals($duration_in_week, $course->duration_in_week);
        $this->assertEquals($position, $course->position);
        $this->assertEquals($is_active, $course->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $course = Course::factory()->create();

        $response = $this->delete(route('course.destroy', $course));

        $response->assertNoContent();

        $this->assertSoftDeleted($course);
    }
}
