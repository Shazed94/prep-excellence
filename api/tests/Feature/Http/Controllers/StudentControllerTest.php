<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\StudentController
 */
class StudentControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $students = Student::factory()->count(3)->create();

        $response = $this->get(route('student.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\StudentController::class,
            'store',
            \App\Http\Requests\StudentStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $is_active = $this->faker->boolean;

        $response = $this->post(route('student.store'), [
            'is_active' => $is_active,
        ]);

        $students = Student::query()
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $students);
        $student = $students->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $student = Student::factory()->create();

        $response = $this->get(route('student.show', $student));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\StudentController::class,
            'update',
            \App\Http\Requests\StudentUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $student = Student::factory()->create();
        $is_active = $this->faker->boolean;

        $response = $this->put(route('student.update', $student), [
            'is_active' => $is_active,
        ]);

        $student->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($is_active, $student->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $student = Student::factory()->create();

        $response = $this->delete(route('student.destroy', $student));

        $response->assertNoContent();

        $this->assertSoftDeleted($student);
    }
}
