<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Religion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\ReligionController
 */
class ReligionControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $religions = Religion::factory()->count(3)->create();

        $response = $this->get(route('religion.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ReligionController::class,
            'store',
            \App\Http\Requests\ReligionStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $name = $this->faker->name;
        $is_active = $this->faker->boolean;

        $response = $this->post(route('religion.store'), [
            'name' => $name,
            'is_active' => $is_active,
        ]);

        $religions = Religion::query()
            ->where('name', $name)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $religions);
        $religion = $religions->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $religion = Religion::factory()->create();

        $response = $this->get(route('religion.show', $religion));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ReligionController::class,
            'update',
            \App\Http\Requests\ReligionUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $religion = Religion::factory()->create();
        $name = $this->faker->name;
        $is_active = $this->faker->boolean;

        $response = $this->put(route('religion.update', $religion), [
            'name' => $name,
            'is_active' => $is_active,
        ]);

        $religion->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($name, $religion->name);
        $this->assertEquals($is_active, $religion->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $religion = Religion::factory()->create();

        $response = $this->delete(route('religion.destroy', $religion));

        $response->assertNoContent();

        $this->assertDeleted($religion);
    }
}
