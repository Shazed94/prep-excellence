<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\CourseCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\CourseCategoryController
 */
class CourseCategoryControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $courseCategories = CourseCategory::factory()->count(3)->create();

        $response = $this->get(route('course-category.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CourseCategoryController::class,
            'store',
            \App\Http\Requests\CourseCategoryStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $position = $this->faker->numberBetween(-10000, 10000);
        $is_active = $this->faker->boolean;

        $response = $this->post(route('course-category.store'), [
            'position' => $position,
            'is_active' => $is_active,
        ]);

        $courseCategories = CourseCategory::query()
            ->where('position', $position)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $courseCategories);
        $courseCategory = $courseCategories->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $courseCategory = CourseCategory::factory()->create();

        $response = $this->get(route('course-category.show', $courseCategory));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CourseCategoryController::class,
            'update',
            \App\Http\Requests\CourseCategoryUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $courseCategory = CourseCategory::factory()->create();
        $position = $this->faker->numberBetween(-10000, 10000);
        $is_active = $this->faker->boolean;

        $response = $this->put(route('course-category.update', $courseCategory), [
            'position' => $position,
            'is_active' => $is_active,
        ]);

        $courseCategory->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($position, $courseCategory->position);
        $this->assertEquals($is_active, $courseCategory->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $courseCategory = CourseCategory::factory()->create();

        $response = $this->delete(route('course-category.destroy', $courseCategory));

        $response->assertNoContent();

        $this->assertSoftDeleted($courseCategory);
    }
}
