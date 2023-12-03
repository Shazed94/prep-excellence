@extends('email.order-master')

@section('title', 'Order Refund')

@section('master')
    <!-- Start header Section -->
    <tr>
        <td style="padding-top: 30px;">
            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner" style="border-bottom: 1px solid #eeeeee; text-align: center;">
                <tbody>
                    <tr>
                        <td style="padding-bottom: 10px;">
                            <a href="{{route('homepage')}}"><img src="{{$settings_g['logo'] ?? ''}}" style="width: 250px;max-width:100%" alt="{{($settings_g['title'] ?? env('APP_NAME'))}}" /></a>
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; line-height: 18px; color: #666666;">
                            {{$settings_g['street'] ?? ''}}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; line-height: 18px; color: #666666;">
                            {{($settings_g['city'] ?? '') . '- ' . ($settings_g['zip'] ?? '') . ', ' . ($settings_g['state'] ?? '') . ', Canada'}}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; line-height: 18px; color: #666666;">
                            Phone: {{$settings_g['mobile_number'] ?? ''}} | Email: {{$settings_g['email'] ?? ''}}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 25px;">
                            <strong>Order Number:</strong> {{$order->id}} | <strong>Order Date:</strong> {{date('m/d/Y', strtotime($order->created_at))}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
    <!-- End header Section -->

    <!-- Start address Section -->
    <tr>
        <td style="padding-top: 0;">
            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner" style="border-bottom: 1px solid #bbbbbb;">
                <tbody>
                    <tr>
                        <td style="width: 55%; font-size: 16px; font-weight: bold; color: #666666; padding-bottom: 5px;">
                            Delivery Adderss
                        </td>
                        <td style="width: 45%; font-size: 16px; font-weight: bold; color: #666666; padding-bottom: 5px;">
                            Billing Address
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                            {{$order->shipping_full_name}}
                        </td>
                        <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                            {{$order->full_name}}
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                            {{$order->shipping_street}}
                        </td>
                        <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                            {{$order->street}}
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 10px;">
                            {{"$order->shipping_city- $order->shipping_post_code, $order->shipping_state, $order->shipping_country"}}
                        </td>
                        <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 10px;">
                            {{"$order->city- $order->zip, $order->state, $order->country"}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
    <!-- End address Section -->

    <!-- Start product Section -->
    @foreach ($order->OrderProducts as $product)
        <tr>
            <td style="padding-top: 0;">
                <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner" style="border-bottom: 1px solid #eeeeee;">
                    <tbody>
                        <tr>
                            <td rowspan="4" style="padding-right: 10px; padding-bottom: 10px;">
                                <img style="height: 80px;" src="{{$product->Product->img_paths['small'] ?? ''}}" alt="{{$product->Product->title ?? 'N/A'}}" />
                            </td>
                            <td colspan="2" style="font-size: 14px; font-weight: bold; color: #666666; padding-bottom: 5px;">
                                {{$product->Product->title ?? 'N/A'}}
                            </td>
                        </tr>
                        <tr>
                            <td style="font-size: 14px; line-height: 18px; color: #757575;">
                                Quantity: {{$product->quantity}}
                            </td>
                            <td style="font-size: 14px; line-height: 18px; color: #757575; text-align: right;">
                                {{($settings_g['currency_symbol'] ?? '$') . number_format($product->usd_price, 2)}} Per Unit
                            </td>
                        </tr>
                        <tr>
                            <td style="font-size: 14px; line-height: 18px; color: #757575; padding-bottom: 10px;">
                                @if($product->ProductData->type == 'Variable')
                                Attributes: {{$product->ProductData->attribute_items_string ?? 'N/A'}}
                                @endif
                            </td>
                            <td style="font-size: 14px; line-height: 18px; color: #757575; text-align: right; padding-bottom: 10px;">
                                <b style="color: #666666;">{{($settings_g['currency_symbol'] ?? '$') . number_format($product->usd_price * $product->quantity, 2)}}</b> Total
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    @endforeach
    <tr>
        <th style="text-align: right">Total: {{$order->product_total}}</th>
    </tr>
    <!-- End product Section -->

    @if($order->status == 'Returned' || $order->status == 'Partial')
    <!-- Start product Section -->
    <tr>
        <th style="text-align: center;background-color: #ff000017;">Returned Items</th>
    </tr>
    @foreach ($order->OrderProducts as $product)
        @if($product->return_quantity)
        <tr style="text-align: center;background-color: #ff000017;">
            <td style="padding-top: 0;">
                <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner" style="border-bottom: 1px solid #eeeeee;">
                    <tbody>
                        <tr>
                            <td rowspan="4" style="padding-right: 10px; padding-bottom: 10px;">
                                <img style="height: 80px;" src="{{$product->Product->img_paths['small'] ?? ''}}" alt="{{$product->Product->title ?? 'N/A'}}" />
                            </td>
                            <td colspan="2" style="font-size: 14px; font-weight: bold; color: #666666; padding-bottom: 5px;">
                                {{$product->Product->title ?? 'N/A'}}
                            </td>
                        </tr>
                        <tr>
                            <td style="font-size: 14px; line-height: 18px; color: #757575;">
                                Quantity: {{$product->return_quantity}}
                            </td>
                            <td style="font-size: 14px; line-height: 18px; color: #757575; text-align: right;">
                                {{($settings_g['currency_symbol'] ?? '$') . number_format($product->usd_price, 2)}} Per Unit
                            </td>
                        </tr>
                        <tr>
                            <td style="font-size: 14px; line-height: 18px; color: #757575; padding-bottom: 10px;">
                                @if($product->ProductData->type == 'Variable')
                                Attributes: {{$product->ProductData->attribute_items_string ?? 'N/A'}}
                                @endif
                            </td>
                            <td style="font-size: 14px; line-height: 18px; color: #757575; text-align: right; padding-bottom: 10px;">
                                <b style="color: #666666;">{{($settings_g['currency_symbol'] ?? '$') . number_format($product->usd_price * $product->quantity, 2)}}</b> Total
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        @endif
    @endforeach
    <tr>
        <th style="text-align: right;font-size: 18px;background-color: #ff000017;">Total: {{($settings_g['currency_symbol'] ?? '$') . number_format($order->refund_product_total, 2)}}</th>
    </tr>
    <!-- End product Section -->
    @endif

    <!-- Start calculation Section -->
    <tr>
        <td style="padding-top: 0;">
            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner" style="margin-top: -5px;">
                <tbody>
                    <tr>
                        <td rowspan="7" style="width: 55%;"></td>
                        <td style="font-size: 14px; line-height: 18px; color: #666666;">
                            Sub-Total:
                        </td>
                        <td style="font-size: 14px; line-height: 18px; color: #666666; width: 130px; text-align: right;">
                            {{($settings_g['currency_symbol'] ?? '$') . number_format($order->product_total, 2)}}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; line-height: 18px; color: #666666;">
                            HST
                        </td>
                        <td style="font-size: 14px; line-height: 18px; color: #666666; text-align: right;">
                            {{($settings_g['currency_symbol'] ?? '$') . number_format($order->tax_amount, 2)}}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; line-height: 18px; color: #666666;">
                            Discount
                        </td>
                        <td style="font-size: 14px; line-height: 18px; color: #666666; text-align: right;">
                            {{($settings_g['currency_symbol'] ?? '$') . number_format($order->discount_amount, 2)}}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 10px; border-bottom: 1px solid #eeeeee;">
                            Shipping Fee:
                        </td>
                        <td style="font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 10px; border-bottom: 1px solid #eeeeee; text-align: right;">
                            {{($settings_g['currency_symbol'] ?? '$') . number_format($order->shipping_charge, 2)}}
                        </td>
                    </tr>

                    @if($order->refund_shipping_amount)
                    <tr>
                        <td style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666;">
                            Shipping Refund
                        </td>
                        <td style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; text-align: right;">
                            {{($settings_g['currency_symbol'] ?? '$') . number_format($order->refund_shipping_amount, 2)}}
                        </td>
                    </tr>
                    @endif
                    @if($order->refund_tax_amount)
                    <tr>
                        <td style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666;">
                            HST Refund
                        </td>
                        <td style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; text-align: right;">
                            {{($settings_g['currency_symbol'] ?? '$') . number_format($order->refund_tax_amount, 2)}}
                        </td>
                    </tr>
                    @endif

                    @if($order->refund_total_amount)
                    <tr>
                        <td style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666;">
                            Refund Amount
                        </td>
                        <td style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; text-align: right;">
                            {{($settings_g['currency_symbol'] ?? '$') . number_format($order->refund_total_amount, 2)}}
                        </td>
                    </tr>
                    @endif

                    <tr>
                        <td style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; padding-top: 10px;">
                            Order Total
                        </td>
                        <td style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; padding-top: 10px; text-align: right;">
                            {{($settings_g['currency_symbol'] ?? '$') . number_format($order->grand_total, 2)}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
    <!-- End calculation Section -->
@endsection
