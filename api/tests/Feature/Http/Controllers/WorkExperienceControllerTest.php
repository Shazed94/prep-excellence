<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\WorkExperience;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\WorkExperienceController
 */
class WorkExperienceControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $workExperiences = WorkExperience::factory()->count(3)->create();

        $response = $this->get(route('work-experience.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\WorkExperienceController::class,
            'store',
            \App\Http\Requests\WorkExperienceStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $is_working = $this->faker->boolean;
        $is_active = $this->faker->boolean;

        $response = $this->post(route('work-experience.store'), [
            'is_working' => $is_working,
            'is_active' => $is_active,
        ]);

        $workExperiences = WorkExperience::query()
            ->where('is_working', $is_working)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $workExperiences);
        $workExperience = $workExperiences->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $workExperience = WorkExperience::factory()->create();

        $response = $this->get(route('work-experience.show', $workExperience));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\WorkExperienceController::class,
            'update',
            \App\Http\Requests\WorkExperienceUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $workExperience = WorkExperience::factory()->create();
        $is_working = $this->faker->boolean;
        $is_active = $this->faker->boolean;

        $response = $this->put(route('work-experience.update', $workExperience), [
            'is_working' => $is_working,
            'is_active' => $is_active,
        ]);

        $workExperience->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($is_working, $workExperience->is_working);
        $this->assertEquals($is_active, $workExperience->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $workExperience = WorkExperience::factory()->create();

        $response = $this->delete(route('work-experience.destroy', $workExperience));

        $response->assertNoContent();

        $this->assertSoftDeleted($workExperience);
    }
}
