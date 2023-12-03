<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\StudentHomeWork;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\StudentHomeWorkController
 */
class StudentHomeWorkControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $studentHomeWorks = StudentHomeWork::factory()->count(3)->create();

        $response = $this->get(route('student-home-work.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\StudentHomeWorkController::class,
            'store',
            \App\Http\Requests\StudentHomeWorkStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $mark = $this->faker->randomFloat(/** double_attributes **/);
        $total_mark = $this->faker->randomFloat(/** double_attributes **/);
        $is_active = $this->faker->boolean;

        $response = $this->post(route('student-home-work.store'), [
            'mark' => $mark,
            'total_mark' => $total_mark,
            'is_active' => $is_active,
        ]);

        $studentHomeWorks = StudentHomeWork::query()
            ->where('mark', $mark)
            ->where('total_mark', $total_mark)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $studentHomeWorks);
        $studentHomeWork = $studentHomeWorks->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $studentHomeWork = StudentHomeWork::factory()->create();

        $response = $this->get(route('student-home-work.show', $studentHomeWork));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\StudentHomeWorkController::class,
            'update',
            \App\Http\Requests\StudentHomeWorkUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $studentHomeWork = StudentHomeWork::factory()->create();
        $mark = $this->faker->randomFloat(/** double_attributes **/);
        $total_mark = $this->faker->randomFloat(/** double_attributes **/);
        $is_active = $this->faker->boolean;

        $response = $this->put(route('student-home-work.update', $studentHomeWork), [
            'mark' => $mark,
            'total_mark' => $total_mark,
            'is_active' => $is_active,
        ]);

        $studentHomeWork->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($mark, $studentHomeWork->mark);
        $this->assertEquals($total_mark, $studentHomeWork->total_mark);
        $this->assertEquals($is_active, $studentHomeWork->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $studentHomeWork = StudentHomeWork::factory()->create();

        $response = $this->delete(route('student-home-work.destroy', $studentHomeWork));

        $response->assertNoContent();

        $this->assertSoftDeleted($studentHomeWork);
    }
}
