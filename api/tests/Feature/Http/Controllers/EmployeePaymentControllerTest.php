<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\EmployeePayment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\EmployeePaymentController
 */
class EmployeePaymentControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $employeePayments = EmployeePayment::factory()->count(3)->create();

        $response = $this->get(route('employee-payment.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\EmployeePaymentController::class,
            'store',
            \App\Http\Requests\EmployeePaymentStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $regular_hour = $this->faker->randomFloat(/** double_attributes **/);
        $ot_hour = $this->faker->randomFloat(/** double_attributes **/);
        $total_hour = $this->faker->randomFloat(/** double_attributes **/);
        $regular_amount = $this->faker->randomFloat(/** double_attributes **/);
        $ot_amount = $this->faker->randomFloat(/** double_attributes **/);
        $total_amount = $this->faker->randomFloat(/** double_attributes **/);
        $regular_hour_rate = $this->faker->randomFloat(/** double_attributes **/);
        $ot_hour_rate = $this->faker->randomFloat(/** double_attributes **/);
        $is_paid = $this->faker->boolean;

        $response = $this->post(route('employee-payment.store'), [
            'regular_hour' => $regular_hour,
            'ot_hour' => $ot_hour,
            'total_hour' => $total_hour,
            'regular_amount' => $regular_amount,
            'ot_amount' => $ot_amount,
            'total_amount' => $total_amount,
            'regular_hour_rate' => $regular_hour_rate,
            'ot_hour_rate' => $ot_hour_rate,
            'is_paid' => $is_paid,
        ]);

        $employeePayments = EmployeePayment::query()
            ->where('regular_hour', $regular_hour)
            ->where('ot_hour', $ot_hour)
            ->where('total_hour', $total_hour)
            ->where('regular_amount', $regular_amount)
            ->where('ot_amount', $ot_amount)
            ->where('total_amount', $total_amount)
            ->where('regular_hour_rate', $regular_hour_rate)
            ->where('ot_hour_rate', $ot_hour_rate)
            ->where('is_paid', $is_paid)
            ->get();
        $this->assertCount(1, $employeePayments);
        $employeePayment = $employeePayments->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $employeePayment = EmployeePayment::factory()->create();

        $response = $this->get(route('employee-payment.show', $employeePayment));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\EmployeePaymentController::class,
            'update',
            \App\Http\Requests\EmployeePaymentUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $employeePayment = EmployeePayment::factory()->create();
        $regular_hour = $this->faker->randomFloat(/** double_attributes **/);
        $ot_hour = $this->faker->randomFloat(/** double_attributes **/);
        $total_hour = $this->faker->randomFloat(/** double_attributes **/);
        $regular_amount = $this->faker->randomFloat(/** double_attributes **/);
        $ot_amount = $this->faker->randomFloat(/** double_attributes **/);
        $total_amount = $this->faker->randomFloat(/** double_attributes **/);
        $regular_hour_rate = $this->faker->randomFloat(/** double_attributes **/);
        $ot_hour_rate = $this->faker->randomFloat(/** double_attributes **/);
        $is_paid = $this->faker->boolean;

        $response = $this->put(route('employee-payment.update', $employeePayment), [
            'regular_hour' => $regular_hour,
            'ot_hour' => $ot_hour,
            'total_hour' => $total_hour,
            'regular_amount' => $regular_amount,
            'ot_amount' => $ot_amount,
            'total_amount' => $total_amount,
            'regular_hour_rate' => $regular_hour_rate,
            'ot_hour_rate' => $ot_hour_rate,
            'is_paid' => $is_paid,
        ]);

        $employeePayment->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($regular_hour, $employeePayment->regular_hour);
        $this->assertEquals($ot_hour, $employeePayment->ot_hour);
        $this->assertEquals($total_hour, $employeePayment->total_hour);
        $this->assertEquals($regular_amount, $employeePayment->regular_amount);
        $this->assertEquals($ot_amount, $employeePayment->ot_amount);
        $this->assertEquals($total_amount, $employeePayment->total_amount);
        $this->assertEquals($regular_hour_rate, $employeePayment->regular_hour_rate);
        $this->assertEquals($ot_hour_rate, $employeePayment->ot_hour_rate);
        $this->assertEquals($is_paid, $employeePayment->is_paid);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $employeePayment = EmployeePayment::factory()->create();

        $response = $this->delete(route('employee-payment.destroy', $employeePayment));

        $response->assertNoContent();

        $this->assertSoftDeleted($employeePayment);
    }
}
