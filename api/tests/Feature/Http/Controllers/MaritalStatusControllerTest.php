<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\MaritalStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\MaritalStatusController
 */
class MaritalStatusControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $maritalStatuses = MaritalStatus::factory()->count(3)->create();

        $response = $this->get(route('marital-status.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\MaritalStatusController::class,
            'store',
            \App\Http\Requests\MaritalStatusStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $name = $this->faker->name;
        $is_active = $this->faker->boolean;

        $response = $this->post(route('marital-status.store'), [
            'name' => $name,
            'is_active' => $is_active,
        ]);

        $maritalStatuses = MaritalStatus::query()
            ->where('name', $name)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $maritalStatuses);
        $maritalStatus = $maritalStatuses->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $maritalStatus = MaritalStatus::factory()->create();

        $response = $this->get(route('marital-status.show', $maritalStatus));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\MaritalStatusController::class,
            'update',
            \App\Http\Requests\MaritalStatusUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $maritalStatus = MaritalStatus::factory()->create();
        $name = $this->faker->name;
        $is_active = $this->faker->boolean;

        $response = $this->put(route('marital-status.update', $maritalStatus), [
            'name' => $name,
            'is_active' => $is_active,
        ]);

        $maritalStatus->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($name, $maritalStatus->name);
        $this->assertEquals($is_active, $maritalStatus->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $maritalStatus = MaritalStatus::factory()->create();

        $response = $this->delete(route('marital-status.destroy', $maritalStatus));

        $response->assertNoContent();

        $this->assertSoftDeleted($maritalStatus);
    }
}
