<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Gender;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\GenderController
 */
class GenderControllerTest extends TestCase
{
    #use AdditionalAssertions, RefreshDatabase, WithFaker;
    use AdditionalAssertions, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $genders = Gender::factory()->count(3)->create();

        $response = $this->get(route('gender.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\GenderController::class,
            'store',
            \App\Http\Requests\GenderStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $name = $this->faker->name;
        $is_active = $this->faker->boolean;

        $response = $this->post(route('gender.store'), [
            'name' => $name,
            'is_active' => $is_active,
        ]);

        $genders = Gender::query()
            ->where('name', $name)
            //->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $genders);
        $gender = $genders->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $gender = Gender::factory()->create();

        $response = $this->get(route('gender.show', $gender));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\GenderController::class,
            'update',
            \App\Http\Requests\GenderUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $gender = Gender::factory()->create();
        $name = $this->faker->name;
        $is_active = $this->faker->boolean;

        $response = $this->put(route('gender.update', $gender), [
            'name' => $name,
            'is_active' => $is_active,
        ]);

        $gender->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($name, $gender->name);
        //$this->assertEquals($is_active, $gender->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $gender = Gender::factory()->create();

        $response = $this->delete(route('gender.destroy', $gender));

        $response->assertOk();

        //$this->assertDeleted($gender);
    }
}
