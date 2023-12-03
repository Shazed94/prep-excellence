<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\MenuPermission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\MenuPermissionController
 */
class MenuPermissionControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $menuPermissions = MenuPermission::factory()->count(3)->create();

        $response = $this->get(route('menu-permission.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\MenuPermissionController::class,
            'store',
            \App\Http\Requests\MenuPermissionStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $menu_id = $this->faker->numberBetween(-100000, 100000);
        $permission_id = $this->faker->numberBetween(-100000, 100000);
        $is_active = $this->faker->boolean;

        $response = $this->post(route('menu-permission.store'), [
            'menu_id' => $menu_id,
            'permission_id' => $permission_id,
            'is_active' => $is_active,
        ]);

        $menuPermissions = MenuPermission::query()
            ->where('menu_id', $menu_id)
            ->where('permission_id', $permission_id)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $menuPermissions);
        $menuPermission = $menuPermissions->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $menuPermission = MenuPermission::factory()->create();

        $response = $this->get(route('menu-permission.show', $menuPermission));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\MenuPermissionController::class,
            'update',
            \App\Http\Requests\MenuPermissionUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $menuPermission = MenuPermission::factory()->create();
        $menu_id = $this->faker->numberBetween(-100000, 100000);
        $permission_id = $this->faker->numberBetween(-100000, 100000);
        $is_active = $this->faker->boolean;

        $response = $this->put(route('menu-permission.update', $menuPermission), [
            'menu_id' => $menu_id,
            'permission_id' => $permission_id,
            'is_active' => $is_active,
        ]);

        $menuPermission->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($menu_id, $menuPermission->menu_id);
        $this->assertEquals($permission_id, $menuPermission->permission_id);
        $this->assertEquals($is_active, $menuPermission->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $menuPermission = MenuPermission::factory()->create();

        $response = $this->delete(route('menu-permission.destroy', $menuPermission));

        $response->assertNoContent();

        $this->assertSoftDeleted($menuPermission);
    }
}
