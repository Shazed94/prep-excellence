<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\CourseSchedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\CourseScheduleController
 */
class CourseScheduleControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $courseSchedules = CourseSchedule::factory()->count(3)->create();

        $response = $this->get(route('course-schedule.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CourseScheduleController::class,
            'store',
            \App\Http\Requests\CourseScheduleStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $is_active = $this->faker->boolean;

        $response = $this->post(route('course-schedule.store'), [
            'is_active' => $is_active,
        ]);

        $courseSchedules = CourseSchedule::query()
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $courseSchedules);
        $courseSchedule = $courseSchedules->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $courseSchedule = CourseSchedule::factory()->create();

        $response = $this->get(route('course-schedule.show', $courseSchedule));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CourseScheduleController::class,
            'update',
            \App\Http\Requests\CourseScheduleUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $courseSchedule = CourseSchedule::factory()->create();
        $is_active = $this->faker->boolean;

        $response = $this->put(route('course-schedule.update', $courseSchedule), [
            'is_active' => $is_active,
        ]);

        $courseSchedule->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($is_active, $courseSchedule->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $courseSchedule = CourseSchedule::factory()->create();

        $response = $this->delete(route('course-schedule.destroy', $courseSchedule));

        $response->assertNoContent();

        $this->assertSoftDeleted($courseSchedule);
    }
}
