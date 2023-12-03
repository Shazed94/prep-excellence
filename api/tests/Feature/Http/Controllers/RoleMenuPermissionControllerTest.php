<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\RoleMenuPermission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\RoleMenuPermissionController
 */
class RoleMenuPermissionControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $roleMenuPermissions = RoleMenuPermission::factory()->count(3)->create();

        $response = $this->get(route('role-menu-permission.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\RoleMenuPermissionController::class,
            'store',
            \App\Http\Requests\RoleMenuPermissionStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $role_id = $this->faker->numberBetween(-100000, 100000);
        $menu_permission_id = $this->faker->numberBetween(-100000, 100000);
        $is_active = $this->faker->boolean;

        $response = $this->post(route('role-menu-permission.store'), [
            'role_id' => $role_id,
            'menu_permission_id' => $menu_permission_id,
            'is_active' => $is_active,
        ]);

        $roleMenuPermissions = RoleMenuPermission::query()
            ->where('role_id', $role_id)
            ->where('menu_permission_id', $menu_permission_id)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $roleMenuPermissions);
        $roleMenuPermission = $roleMenuPermissions->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $roleMenuPermission = RoleMenuPermission::factory()->create();

        $response = $this->get(route('role-menu-permission.show', $roleMenuPermission));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\RoleMenuPermissionController::class,
            'update',
            \App\Http\Requests\RoleMenuPermissionUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $roleMenuPermission = RoleMenuPermission::factory()->create();
        $role_id = $this->faker->numberBetween(-100000, 100000);
        $menu_permission_id = $this->faker->numberBetween(-100000, 100000);
        $is_active = $this->faker->boolean;

        $response = $this->put(route('role-menu-permission.update', $roleMenuPermission), [
            'role_id' => $role_id,
            'menu_permission_id' => $menu_permission_id,
            'is_active' => $is_active,
        ]);

        $roleMenuPermission->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($role_id, $roleMenuPermission->role_id);
        $this->assertEquals($menu_permission_id, $roleMenuPermission->menu_permission_id);
        $this->assertEquals($is_active, $roleMenuPermission->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $roleMenuPermission = RoleMenuPermission::factory()->create();

        $response = $this->delete(route('role-menu-permission.destroy', $roleMenuPermission));

        $response->assertNoContent();

        $this->assertSoftDeleted($roleMenuPermission);
    }
}
