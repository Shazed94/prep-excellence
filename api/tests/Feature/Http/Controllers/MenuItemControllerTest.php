<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\MenuItemController
 */
class MenuItemControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $menuItems = MenuItem::factory()->count(3)->create();

        $response = $this->get(route('menu-item.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\MenuItemController::class,
            'store',
            \App\Http\Requests\MenuItemStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $position = $this->faker->numberBetween(-10000, 10000);
        $status = $this->faker->boolean;

        $response = $this->post(route('menu-item.store'), [
            'position' => $position,
            'status' => $status,
        ]);

        $menuItems = MenuItem::query()
            ->where('position', $position)
            ->where('status', $status)
            ->get();
        $this->assertCount(1, $menuItems);
        $menuItem = $menuItems->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $menuItem = MenuItem::factory()->create();

        $response = $this->get(route('menu-item.show', $menuItem));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\MenuItemController::class,
            'update',
            \App\Http\Requests\MenuItemUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $menuItem = MenuItem::factory()->create();
        $position = $this->faker->numberBetween(-10000, 10000);
        $status = $this->faker->boolean;

        $response = $this->put(route('menu-item.update', $menuItem), [
            'position' => $position,
            'status' => $status,
        ]);

        $menuItem->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($position, $menuItem->position);
        $this->assertEquals($status, $menuItem->status);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $menuItem = MenuItem::factory()->create();

        $response = $this->delete(route('menu-item.destroy', $menuItem));

        $response->assertNoContent();

        $this->assertSoftDeleted($menuItem);
    }
}
