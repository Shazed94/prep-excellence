<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Order;
use App\Models\User;

class OrderFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'status' => $this->faker->regexify('[A-Za-z0-9]{60}'),
            'admin_read' => $this->faker->boolean,
            'payment_status' => $this->faker->regexify('[A-Za-z0-9]{30}'),
            'user_id' => User::factory(),
            'product_total' => $this->faker->numberBetween(-10000, 10000),
            'tax' => $this->faker->numberBetween(-10000, 10000),
            'tax_amount' => $this->faker->numberBetween(-10000, 10000),
            'other_cost' => $this->faker->numberBetween(-10000, 10000),
            'discount' => $this->faker->numberBetween(-10000, 10000),
            'discount_amount' => $this->faker->numberBetween(-10000, 10000),
            'payment_method' => $this->faker->regexify('[A-Za-z0-9]{60}'),
            'payment_transaction_id' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'refund_other_charge' => $this->faker->numberBetween(-10000, 10000),
            'refund_product_total' => $this->faker->numberBetween(-10000, 10000),
            'refund_tax_amount' => $this->faker->numberBetween(-10000, 10000),
            'refund_total_amount' => $this->faker->numberBetween(-10000, 10000),
            'coupon_id' => User::factory(),
            'coupon_code' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'note' => $this->faker->text,
            'staff_note' => $this->faker->text,
            'reference_no' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'attachment' => $this->faker->regexify('[A-Za-z0-9]{191}'),
        ];
    }
}
