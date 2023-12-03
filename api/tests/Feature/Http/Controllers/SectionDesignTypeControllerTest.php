<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\SectionDesignType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\SectionDesignTypeController
 */
class SectionDesignTypeControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $sectionDesignTypes = SectionDesignType::factory()->count(3)->create();

        $response = $this->get(route('section-design-type.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\SectionDesignTypeController::class,
            'store',
            \App\Http\Requests\SectionDesignTypeStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $name = $this->faker->name;
        $is_active = $this->faker->boolean;

        $response = $this->post(route('section-design-type.store'), [
            'name' => $name,
            'is_active' => $is_active,
        ]);

        $sectionDesignTypes = SectionDesignType::query()
            ->where('name', $name)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $sectionDesignTypes);
        $sectionDesignType = $sectionDesignTypes->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $sectionDesignType = SectionDesignType::factory()->create();

        $response = $this->get(route('section-design-type.show', $sectionDesignType));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\SectionDesignTypeController::class,
            'update',
            \App\Http\Requests\SectionDesignTypeUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $sectionDesignType = SectionDesignType::factory()->create();
        $name = $this->faker->name;
        $is_active = $this->faker->boolean;

        $response = $this->put(route('section-design-type.update', $sectionDesignType), [
            'name' => $name,
            'is_active' => $is_active,
        ]);

        $sectionDesignType->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($name, $sectionDesignType->name);
        $this->assertEquals($is_active, $sectionDesignType->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $sectionDesignType = SectionDesignType::factory()->create();

        $response = $this->delete(route('section-design-type.destroy', $sectionDesignType));

        $response->assertNoContent();

        $this->assertSoftDeleted($sectionDesignType);
    }
}
