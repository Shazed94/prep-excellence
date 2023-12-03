<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\TutorialCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\TutorialCategoryController
 */
class TutorialCategoryControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $tutorialCategories = TutorialCategory::factory()->count(3)->create();

        $response = $this->get(route('tutorial-category.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\TutorialCategoryController::class,
            'store',
            \App\Http\Requests\TutorialCategoryStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $response = $this->post(route('tutorial-category.store'));

        $response->assertCreated();
        $response->assertJsonStructure([]);

        $this->assertDatabaseHas(tutorialCategories, [ /* ... */ ]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $tutorialCategory = TutorialCategory::factory()->create();

        $response = $this->get(route('tutorial-category.show', $tutorialCategory));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\TutorialCategoryController::class,
            'update',
            \App\Http\Requests\TutorialCategoryUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $tutorialCategory = TutorialCategory::factory()->create();

        $response = $this->put(route('tutorial-category.update', $tutorialCategory));

        $tutorialCategory->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $tutorialCategory = TutorialCategory::factory()->create();

        $response = $this->delete(route('tutorial-category.destroy', $tutorialCategory));

        $response->assertNoContent();

        $this->assertSoftDeleted($tutorialCategory);
    }
}
