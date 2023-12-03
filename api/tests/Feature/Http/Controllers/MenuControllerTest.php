<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Menu;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\MenuController
 */
class MenuControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $menus = Menu::factory()->count(3)->create();

        $response = $this->get(route('menu.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\MenuController::class,
            'store',
            \App\Http\Requests\MenuStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $name = $this->faker->name;
        $alias = $this->faker->word;
        $type = $this->faker->numberBetween(-8, 8);
        $is_active = $this->faker->boolean;

        $response = $this->post(route('menu.store'), [
            'name' => $name,
            'alias' => $alias,
            'type' => $type,
            'is_active' => $is_active,
        ]);

        $menus = Menu::query()
            ->where('name', $name)
            ->where('alias', $alias)
            ->where('type', $type)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $menus);
        $menu = $menus->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $menu = Menu::factory()->create();

        $response = $this->get(route('menu.show', $menu));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\MenuController::class,
            'update',
            \App\Http\Requests\MenuUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $menu = Menu::factory()->create();
        $name = $this->faker->name;
        $alias = $this->faker->word;
        $type = $this->faker->numberBetween(-8, 8);
        $is_active = $this->faker->boolean;

        $response = $this->put(route('menu.update', $menu), [
            'name' => $name,
            'alias' => $alias,
            'type' => $type,
            'is_active' => $is_active,
        ]);

        $menu->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($name, $menu->name);
        $this->assertEquals($alias, $menu->alias);
        $this->assertEquals($type, $menu->type);
        $this->assertEquals($is_active, $menu->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $menu = Menu::factory()->create();

        $response = $this->delete(route('menu.destroy', $menu));

        $response->assertNoContent();

        $this->assertSoftDeleted($menu);
    }
}
