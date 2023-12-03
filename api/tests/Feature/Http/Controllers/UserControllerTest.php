<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\UserController
 */
class UserControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $users = User::factory()->count(3)->create();

        $response = $this->get(route('user.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\UserController::class,
            'store',
            \App\Http\Requests\UserStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $userable_type = $this->faker->word;
        $userable_id = $this->faker->numberBetween(-100000, 100000);
        $name = $this->faker->name;
        $phone_number = $this->faker->phoneNumber;
        $password = $this->faker->password;
        $is_active = $this->faker->boolean;

        $response = $this->post(route('user.store'), [
            'userable_type' => $userable_type,
            'userable_id' => $userable_id,
            'name' => $name,
            'phone_number' => $phone_number,
            'password' => $password,
            'is_active' => $is_active,
        ]);

        $users = User::query()
            ->where('userable_type', $userable_type)
            ->where('userable_id', $userable_id)
            ->where('name', $name)
            ->where('phone_number', $phone_number)
            ->where('password', $password)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $users);
        $user = $users->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $user = User::factory()->create();

        $response = $this->get(route('user.show', $user));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\UserController::class,
            'update',
            \App\Http\Requests\UserUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $user = User::factory()->create();
        $userable_type = $this->faker->word;
        $userable_id = $this->faker->numberBetween(-100000, 100000);
        $name = $this->faker->name;
        $phone_number = $this->faker->phoneNumber;
        $password = $this->faker->password;
        $is_active = $this->faker->boolean;

        $response = $this->put(route('user.update', $user), [
            'userable_type' => $userable_type,
            'userable_id' => $userable_id,
            'name' => $name,
            'phone_number' => $phone_number,
            'password' => $password,
            'is_active' => $is_active,
        ]);

        $user->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($userable_type, $user->userable_type);
        $this->assertEquals($userable_id, $user->userable_id);
        $this->assertEquals($name, $user->name);
        $this->assertEquals($phone_number, $user->phone_number);
        $this->assertEquals($password, $user->password);
        $this->assertEquals($is_active, $user->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $user = User::factory()->create();

        $response = $this->delete(route('user.destroy', $user));

        $response->assertNoContent();

        $this->assertSoftDeleted($user);
    }
}
