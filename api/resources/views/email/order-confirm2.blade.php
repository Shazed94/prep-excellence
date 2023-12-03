@extends('email.order-master')

@section('title', 'Order Confirmation')
@php
    $settings = \App\Models\Setting::orderBy('id','ASC')->get();
@endphp
@section('master')
    <!-- Start header Section -->
    <tr>
        <td style="padding-top: 30px;">
            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner" style="border-bottom: 1px solid #eeeeee; text-align: center;">
                <tbody>
                    <tr>
                        <td style="padding-bottom: 10px;">
                            @php
                                $tt = $settings->where('group','general')->where('name','logo')->first();
                            @endphp
                            <a href="{{ env('FRONTEND_URL') }}">
                                <img style="width: 250px;max-width:100%" src="{{ isset($tt->value) ? asset($tt->value) : '' }}" alt="{{ env('APP_NAME') }}" /></a>
                        </td>
                    </tr>
                    @php
                        $tt2 = $settings->where('group','general')->where('name','street')->first();
                    @endphp
                    @if(isset($tt2->value))
                    <tr>
                        <td style="font-size: 14px; line-height: 18px; color: #666666;">
                            {{ $tt2->value }}
                        </td>
                    </tr>
                    @endif
                    @php
                        $tt3 = $settings->where('group','general')->where('name','city')->first();
                        $tt4 = $settings->where('group','general')->where('name','zip')->first();
                        $tt5 = $settings->where('group','general')->where('name','state')->first();
                        $tt6 = $settings->where('group','general')->where('name','country')->first();
                    @endphp
                    @if( isset($tt3->value) || isset($tt4->value) || isset($tt5->value) || isset($tt6->value) )
                    <tr>
                        <td style="font-size: 14px; line-height: 18px; color: #666666;">
                            {{ ($tt3->value ?? ' ') . '- ' . ($tt4->value ?? ' ') . ', ' . ($tt5->value ?? ' ') . ($tt6->value ?? '') }}
                        </td>
                    </tr>
                    @endif

                    @php
                        $tt7 = $settings->where('group','general')->where('name','mobile_number')->first();
                        $tt8 = $settings->where('group','general')->where('name','email')->first();
                    @endphp
                    @if(isset($tt7->value) || isset($tt8->value))
                        <tr>
                            <td style="font-size: 14px; line-height: 18px; color: #666666;">
                                Phone: {{$tt7->value ?? ''}} | Email: {{$tt8->value ?? ''}}
                            </td>
                        </tr>
                    @endif
                    <tr>
                        <td style="font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 25px;">
                            <strong>Order Number:</strong> #{{ $orders->id }} | <strong>Order Date:</strong> {{date('m/d/Y', strtotime($orders->created_at))}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
    <!-- End header Section -->

    <!-- Start product Section -->
    @foreach($orders->studentCourses  as $order)
        <tr>
            <td style="padding-top: 0;">
            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner" style="border-bottom: 1px solid #eeeeee;">
                <tbody>
                    <tr>
                        <td rowspan="4" style="padding-right: 10px; padding-bottom: 10px;">
                            <img style="height: 80px;" src="{{$order->course ? $order->course->image: ''}}" alt="{{$order->course ? $order->course->name : 'N/A'}}" />
                        </td>
                        <td colspan="2" style="font-size: 14px; font-weight: bold; color: #666666; padding-bottom: 5px;">
                            {{$order->course ? $order->course->name : 'N/A'}}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; line-height: 18px; color: #757575; padding-bottom: 10px;">

                        </td>
                        <td style="font-size: 14px; line-height: 18px; color: #757575; text-align: right; padding-bottom: 10px;">
                            <b style="color: #666666;">{{'$' . number_format($order->amount, 2)}}</b>
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
        </tr>
    @endforeach
    <!-- End product Section -->
{{-- {{dd($print_btn)}} --}}
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
                            {{'$' . number_format($orders->product_total, 2) }}
                        </td>
                    </tr>
                    {{--<tr>
                        <td style="font-size: 14px; line-height: 18px; color: #666666;">
                            HST
                        </td>
                        <td style="font-size: 14px; line-height: 18px; color: #666666; text-align: right;">
                            {{'$' . number_format($order->tax_amount, 2)}}
                        </td>
                    </tr>--}}
                    <tr>
                        <td style="font-size: 14px; line-height: 18px; color: #666666;">
                            Discount
                        </td>
                        <td style="font-size: 14px; line-height: 18px; color: #666666; text-align: right;">
                            {{'$' . number_format($orders->discount_amount, 2)}}
                        </td>
                    </tr>
                    {{--<tr>
                        <td style="font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 10px; border-bottom: 1px solid #eeeeee;">
                            Shipping Fee:
                        </td>
                        <td style="font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 10px; border-bottom: 1px solid #eeeeee; text-align: right;">
                            {{'$' . number_format($order->shipping_charge, 2)}}
                        </td>
                    </tr>--}}
                    <tr>
                        <td style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; padding-top: 10px;">
                            Order Total
                        </td>
                        <td style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; padding-top: 10px; text-align: right;">
                            {{'$' . number_format($orders->total, 2)}}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; padding-top: 10px;">
                            Payment Status:
                        </td>
                        <td style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; padding-top: 10px; text-align: right;">
                            Successful
                        </td>
                    </tr>
                    {{--@if($print_btn)
                    <tr>
                        <td colspan="2" style="text-align:right;">
                            <a href="{{route('orderLabelPrint', $order->id)}}" class="action_btn">Print Label</a>
                        </td>
                    </tr>
                    @endif--}}
                </tbody>
            </table>
        </td>
    </tr>
    <!-- End calculation Section -->
@endsection
