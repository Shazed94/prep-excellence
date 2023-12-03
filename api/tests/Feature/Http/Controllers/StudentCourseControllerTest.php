<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\StudentCourse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\StudentCourseController
 */
class StudentCourseControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $studentCourses = StudentCourse::factory()->count(3)->create();

        $response = $this->get(route('student-course.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\StudentCourseController::class,
            'store',
            \App\Http\Requests\StudentCourseStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $amount = $this->faker->randomFloat(/** double_attributes **/);
        $is_approved = $this->faker->boolean;
        $is_active = $this->faker->boolean;

        $response = $this->post(route('student-course.store'), [
            'amount' => $amount,
            'is_approved' => $is_approved,
            'is_active' => $is_active,
        ]);

        $studentCourses = StudentCourse::query()
            ->where('amount', $amount)
            ->where('is_approved', $is_approved)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $studentCourses);
        $studentCourse = $studentCourses->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $studentCourse = StudentCourse::factory()->create();

        $response = $this->get(route('student-course.show', $studentCourse));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\StudentCourseController::class,
            'update',
            \App\Http\Requests\StudentCourseUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $studentCourse = StudentCourse::factory()->create();
        $amount = $this->faker->randomFloat(/** double_attributes **/);
        $is_approved = $this->faker->boolean;
        $is_active = $this->faker->boolean;

        $response = $this->put(route('student-course.update', $studentCourse), [
            'amount' => $amount,
            'is_approved' => $is_approved,
            'is_active' => $is_active,
        ]);

        $studentCourse->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($amount, $studentCourse->amount);
        $this->assertEquals($is_approved, $studentCourse->is_approved);
        $this->assertEquals($is_active, $studentCourse->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $studentCourse = StudentCourse::factory()->create();

        $response = $this->delete(route('student-course.destroy', $studentCourse));

        $response->assertNoContent();

        $this->assertSoftDeleted($studentCourse);
    }
}
