<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\BloodGroup;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\BloodGroupController
 */
class BloodGroupControllerTest extends TestCase
{
    #use AdditionalAssertions, RefreshDatabase, WithFaker;
    use AdditionalAssertions, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $bloodGroups = BloodGroup::factory()->count(3)->create();

        $response = $this->get(route('blood-group.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\BloodGroupController::class,
            'store',
            \App\Http\Requests\BloodGroupStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $name = $this->faker->name;
        $is_active = $this->faker->boolean;

        $response = $this->post(route('blood-group.store'), [
            'name' => $name,
            'is_active' => $is_active,
        ]);

        $bloodGroups = BloodGroup::query()
            ->where('name', $name)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $bloodGroups);
        $bloodGroup = $bloodGroups->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $bloodGroup = BloodGroup::factory()->create();

        $response = $this->get(route('blood-group.show', $bloodGroup));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\BloodGroupController::class,
            'update',
            \App\Http\Requests\BloodGroupUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $bloodGroup = BloodGroup::factory()->create();
        $name = $this->faker->name;
        //$is_active = $this->faker->boolean;

        $response = $this->put(route('blood-group.update', $bloodGroup->id), [
            'name' => $name,
            //'is_active' => $is_active,
        ]);
        //info(json_encode($response));
        $bloodGroup->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($name, $bloodGroup->name);
        //$this->assertEquals($is_active, $bloodGroup->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $bloodGroup = BloodGroup::factory()->create();

        $response = $this->delete(route('blood-group.destroy', $bloodGroup));

        $response->assertOk();
        #$response->assertNoContent();

        //$this->assertNotSoftDeleted($bloodGroup);
    }

    /**
     * @test
     */
    public function toggle_and_responds_with()
    {
        $bloodGroup = BloodGroup::factory()->create();
        //$name = $this->faker->name;
        $is_active = $this->faker->boolean;

        $response = $this->put(route('blood-group.toggle', $bloodGroup));
        //info(json_encode($response));
        $bloodGroup->refresh();

        $response->assertOk();
        $this->assertEquals(!$is_active, $bloodGroup->is_active);
    }
}
