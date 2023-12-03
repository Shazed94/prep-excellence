<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\UserMenuPermission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\UserPermissionController
 */
class UserPermissionControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $userPermissions = UserMenuPermission::factory()->count(3)->create();

        $response = $this->get(route('user-permission.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\UserPermissionController::class,
            'store',
            \App\Http\Requests\UserPermissionStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $user_id = $this->faker->numberBetween(-100000, 100000);
        $permission_id = $this->faker->numberBetween(-100000, 100000);
        $is_active = $this->faker->boolean;

        $response = $this->post(route('user-permission.store'), [
            'user_id' => $user_id,
            'permission_id' => $permission_id,
            'is_active' => $is_active,
        ]);

        $userPermissions = UserMenuPermission::query()
            ->where('user_id', $user_id)
            ->where('permission_id', $permission_id)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $userPermissions);
        $userPermission = $userPermissions->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $userPermission = UserMenuPermission::factory()->create();

        $response = $this->get(route('user-permission.show', $userPermission));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\UserPermissionController::class,
            'update',
            \App\Http\Requests\UserPermissionUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $userPermission = UserMenuPermission::factory()->create();
        $user_id = $this->faker->numberBetween(-100000, 100000);
        $permission_id = $this->faker->numberBetween(-100000, 100000);
        $is_active = $this->faker->boolean;

        $response = $this->put(route('user-permission.update', $userPermission), [
            'user_id' => $user_id,
            'permission_id' => $permission_id,
            'is_active' => $is_active,
        ]);

        $userPermission->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($user_id, $userPermission->user_id);
        $this->assertEquals($permission_id, $userPermission->permission_id);
        $this->assertEquals($is_active, $userPermission->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $userPermission = UserMenuPermission::factory()->create();

        $response = $this->delete(route('user-permission.destroy', $userPermission));

        $response->assertNoContent();

        $this->assertSoftDeleted($userPermission);
    }
}
