<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Widget;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\WidgetController
 */
class WidgetControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $widgets = Widget::factory()->count(3)->create();

        $response = $this->get(route('widget.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\WidgetController::class,
            'store',
            \App\Http\Requests\WidgetStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $position = $this->faker->numberBetween(-10000, 10000);
        $status = $this->faker->boolean;

        $response = $this->post(route('widget.store'), [
            'position' => $position,
            'status' => $status,
        ]);

        $widgets = Widget::query()
            ->where('position', $position)
            ->where('status', $status)
            ->get();
        $this->assertCount(1, $widgets);
        $widget = $widgets->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $widget = Widget::factory()->create();

        $response = $this->get(route('widget.show', $widget));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\WidgetController::class,
            'update',
            \App\Http\Requests\WidgetUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $widget = Widget::factory()->create();
        $position = $this->faker->numberBetween(-10000, 10000);
        $status = $this->faker->boolean;

        $response = $this->put(route('widget.update', $widget), [
            'position' => $position,
            'status' => $status,
        ]);

        $widget->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($position, $widget->position);
        $this->assertEquals($status, $widget->status);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $widget = Widget::factory()->create();

        $response = $this->delete(route('widget.destroy', $widget));

        $response->assertNoContent();

        $this->assertSoftDeleted($widget);
    }
}
