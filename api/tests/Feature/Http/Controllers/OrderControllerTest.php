<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\OrderController
 */
class OrderControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $orders = Order::factory()->count(3)->create();

        $response = $this->get(route('order.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\OrderController::class,
            'store',
            \App\Http\Requests\OrderStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $admin_read = $this->faker->boolean;
        $product_total = $this->faker->numberBetween(-10000, 10000);
        $tax = $this->faker->numberBetween(-10000, 10000);
        $tax_amount = $this->faker->numberBetween(-10000, 10000);
        $other_cost = $this->faker->numberBetween(-10000, 10000);
        $discount = $this->faker->numberBetween(-10000, 10000);
        $discount_amount = $this->faker->numberBetween(-10000, 10000);
        $refund_other_charge = $this->faker->numberBetween(-10000, 10000);
        $refund_product_total = $this->faker->numberBetween(-10000, 10000);
        $refund_tax_amount = $this->faker->numberBetween(-10000, 10000);
        $refund_total_amount = $this->faker->numberBetween(-10000, 10000);

        $response = $this->post(route('order.store'), [
            'admin_read' => $admin_read,
            'product_total' => $product_total,
            'tax' => $tax,
            'tax_amount' => $tax_amount,
            'other_cost' => $other_cost,
            'discount' => $discount,
            'discount_amount' => $discount_amount,
            'refund_other_charge' => $refund_other_charge,
            'refund_product_total' => $refund_product_total,
            'refund_tax_amount' => $refund_tax_amount,
            'refund_total_amount' => $refund_total_amount,
        ]);

        $orders = Order::query()
            ->where('admin_read', $admin_read)
            ->where('product_total', $product_total)
            ->where('tax', $tax)
            ->where('tax_amount', $tax_amount)
            ->where('other_cost', $other_cost)
            ->where('discount', $discount)
            ->where('discount_amount', $discount_amount)
            ->where('refund_other_charge', $refund_other_charge)
            ->where('refund_product_total', $refund_product_total)
            ->where('refund_tax_amount', $refund_tax_amount)
            ->where('refund_total_amount', $refund_total_amount)
            ->get();
        $this->assertCount(1, $orders);
        $order = $orders->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $order = Order::factory()->create();

        $response = $this->get(route('order.show', $order));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\OrderController::class,
            'update',
            \App\Http\Requests\OrderUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $order = Order::factory()->create();
        $admin_read = $this->faker->boolean;
        $product_total = $this->faker->numberBetween(-10000, 10000);
        $tax = $this->faker->numberBetween(-10000, 10000);
        $tax_amount = $this->faker->numberBetween(-10000, 10000);
        $other_cost = $this->faker->numberBetween(-10000, 10000);
        $discount = $this->faker->numberBetween(-10000, 10000);
        $discount_amount = $this->faker->numberBetween(-10000, 10000);
        $refund_other_charge = $this->faker->numberBetween(-10000, 10000);
        $refund_product_total = $this->faker->numberBetween(-10000, 10000);
        $refund_tax_amount = $this->faker->numberBetween(-10000, 10000);
        $refund_total_amount = $this->faker->numberBetween(-10000, 10000);

        $response = $this->put(route('order.update', $order), [
            'admin_read' => $admin_read,
            'product_total' => $product_total,
            'tax' => $tax,
            'tax_amount' => $tax_amount,
            'other_cost' => $other_cost,
            'discount' => $discount,
            'discount_amount' => $discount_amount,
            'refund_other_charge' => $refund_other_charge,
            'refund_product_total' => $refund_product_total,
            'refund_tax_amount' => $refund_tax_amount,
            'refund_total_amount' => $refund_total_amount,
        ]);

        $order->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($admin_read, $order->admin_read);
        $this->assertEquals($product_total, $order->product_total);
        $this->assertEquals($tax, $order->tax);
        $this->assertEquals($tax_amount, $order->tax_amount);
        $this->assertEquals($other_cost, $order->other_cost);
        $this->assertEquals($discount, $order->discount);
        $this->assertEquals($discount_amount, $order->discount_amount);
        $this->assertEquals($refund_other_charge, $order->refund_other_charge);
        $this->assertEquals($refund_product_total, $order->refund_product_total);
        $this->assertEquals($refund_tax_amount, $order->refund_tax_amount);
        $this->assertEquals($refund_total_amount, $order->refund_total_amount);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $order = Order::factory()->create();

        $response = $this->delete(route('order.destroy', $order));

        $response->assertNoContent();

        $this->assertSoftDeleted($order);
    }
}
