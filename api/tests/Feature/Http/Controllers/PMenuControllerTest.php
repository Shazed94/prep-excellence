<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\PMenu;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\PMenuController
 */
class PMenuControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $pMenus = PMenu::factory()->count(3)->create();

        $response = $this->get(route('p-menu.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\PMenuController::class,
            'store',
            \App\Http\Requests\PMenuStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $status = $this->faker->boolean;
        $position = $this->faker->numberBetween(-10000, 10000);

        $response = $this->post(route('p-menu.store'), [
            'status' => $status,
            'position' => $position,
        ]);

        $pMenus = PMenu::query()
            ->where('status', $status)
            ->where('position', $position)
            ->get();
        $this->assertCount(1, $pMenus);
        $pMenu = $pMenus->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $pMenu = PMenu::factory()->create();

        $response = $this->get(route('p-menu.show', $pMenu));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\PMenuController::class,
            'update',
            \App\Http\Requests\PMenuUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $pMenu = PMenu::factory()->create();
        $status = $this->faker->boolean;
        $position = $this->faker->numberBetween(-10000, 10000);

        $response = $this->put(route('p-menu.update', $pMenu), [
            'status' => $status,
            'position' => $position,
        ]);

        $pMenu->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($status, $pMenu->status);
        $this->assertEquals($position, $pMenu->position);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $pMenu = PMenu::factory()->create();

        $response = $this->delete(route('p-menu.destroy', $pMenu));

        $response->assertNoContent();

        $this->assertSoftDeleted($pMenu);
    }
}
