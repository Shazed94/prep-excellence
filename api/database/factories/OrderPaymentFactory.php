<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Order;
use App\Models\OrderPayment;

class OrderPaymentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = OrderPayment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'status' => $this->faker->regexify('[A-Za-z0-9]{60}'),
            'order_id' => Order::factory(),
            'amount' => $this->faker->numberBetween(-10000, 10000),
            'gateway_order_id' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'refund_order_id' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'txn_number' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'receipt_url' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'note' => $this->faker->text,
        ];
    }
}
