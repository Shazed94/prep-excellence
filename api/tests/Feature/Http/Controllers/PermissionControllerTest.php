<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\PermissionController
 */
class PermissionControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $permissions = Permission::factory()->count(3)->create();

        $response = $this->get(route('permission.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\PermissionController::class,
            'store',
            \App\Http\Requests\PermissionStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $name = $this->faker->name;
        $alias = $this->faker->word;
        $is_active = $this->faker->boolean;

        $response = $this->post(route('permission.store'), [
            'name' => $name,
            'alias' => $alias,
            'is_active' => $is_active,
        ]);

        $permissions = Permission::query()
            ->where('name', $name)
            ->where('alias', $alias)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $permissions);
        $permission = $permissions->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $permission = Permission::factory()->create();

        $response = $this->get(route('permission.show', $permission));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\PermissionController::class,
            'update',
            \App\Http\Requests\PermissionUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $permission = Permission::factory()->create();
        $name = $this->faker->name;
        $alias = $this->faker->word;
        $is_active = $this->faker->boolean;

        $response = $this->put(route('permission.update', $permission), [
            'name' => $name,
            'alias' => $alias,
            'is_active' => $is_active,
        ]);

        $permission->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($name, $permission->name);
        $this->assertEquals($alias, $permission->alias);
        $this->assertEquals($is_active, $permission->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $permission = Permission::factory()->create();

        $response = $this->delete(route('permission.destroy', $permission));

        $response->assertNoContent();

        $this->assertSoftDeleted($permission);
    }
}
