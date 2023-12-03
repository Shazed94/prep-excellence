<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\CourseMaterial;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\CourseMaterialController
 */
class CourseMaterialControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $courseMaterials = CourseMaterial::factory()->count(3)->create();

        $response = $this->get(route('course-material.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CourseMaterialController::class,
            'store',
            \App\Http\Requests\CourseMaterialStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $type = $this->faker->numberBetween(-8, 8);
        $position = $this->faker->numberBetween(-10000, 10000);
        $is_active = $this->faker->boolean;

        $response = $this->post(route('course-material.store'), [
            'type' => $type,
            'position' => $position,
            'is_active' => $is_active,
        ]);

        $courseMaterials = CourseMaterial::query()
            ->where('type', $type)
            ->where('position', $position)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $courseMaterials);
        $courseMaterial = $courseMaterials->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $courseMaterial = CourseMaterial::factory()->create();

        $response = $this->get(route('course-material.show', $courseMaterial));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CourseMaterialController::class,
            'update',
            \App\Http\Requests\CourseMaterialUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $courseMaterial = CourseMaterial::factory()->create();
        $type = $this->faker->numberBetween(-8, 8);
        $position = $this->faker->numberBetween(-10000, 10000);
        $is_active = $this->faker->boolean;

        $response = $this->put(route('course-material.update', $courseMaterial), [
            'type' => $type,
            'position' => $position,
            'is_active' => $is_active,
        ]);

        $courseMaterial->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($type, $courseMaterial->type);
        $this->assertEquals($position, $courseMaterial->position);
        $this->assertEquals($is_active, $courseMaterial->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $courseMaterial = CourseMaterial::factory()->create();

        $response = $this->delete(route('course-material.destroy', $courseMaterial));

        $response->assertNoContent();

        $this->assertSoftDeleted($courseMaterial);
    }
}
