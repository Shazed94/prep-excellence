<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\CourseType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\CourseTypeController
 */
class CourseTypeControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $courseTypes = CourseType::factory()->count(3)->create();

        $response = $this->get(route('course-type.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CourseTypeController::class,
            'store',
            \App\Http\Requests\CourseTypeStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $position = $this->faker->numberBetween(-10000, 10000);
        $is_active = $this->faker->boolean;

        $response = $this->post(route('course-type.store'), [
            'position' => $position,
            'is_active' => $is_active,
        ]);

        $courseTypes = CourseType::query()
            ->where('position', $position)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $courseTypes);
        $courseType = $courseTypes->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $courseType = CourseType::factory()->create();

        $response = $this->get(route('course-type.show', $courseType));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CourseTypeController::class,
            'update',
            \App\Http\Requests\CourseTypeUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $courseType = CourseType::factory()->create();
        $position = $this->faker->numberBetween(-10000, 10000);
        $is_active = $this->faker->boolean;

        $response = $this->put(route('course-type.update', $courseType), [
            'position' => $position,
            'is_active' => $is_active,
        ]);

        $courseType->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($position, $courseType->position);
        $this->assertEquals($is_active, $courseType->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $courseType = CourseType::factory()->create();

        $response = $this->delete(route('course-type.destroy', $courseType));

        $response->assertNoContent();

        $this->assertSoftDeleted($courseType);
    }
}
