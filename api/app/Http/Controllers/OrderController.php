<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderStoreRequest;
use App\Http\Requests\OrderUpdateRequest;
use App\Http\Resources\OrderCollection;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Traits\ReportTrait;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\OrderCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $status = request('status');
        $orders = Order::query();
        if ($search) {
            $orders->whereLike(['user.name','user.email','user.phone_number','id'], $search);
        }
        if ($status != 'null') $orders->where('payment_status',$status);
        $orders = $orders->with(['user','studentCourses','courses','orderPayment'])->orderBy('id','DESC')->paginate($itemsPerPage);

        return new OrderCollection($orders);
    }

    /**
     * @param \App\Http\Requests\OrderStoreRequest $request
     * @return \App\Http\Resources\OrderResource
     */
    public function store(OrderStoreRequest $request)
    {
        $order = Order::create($request->validated());

        return new OrderResource($order);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Order $order
     * @return \App\Http\Resources\OrderResource
     */
    public function show(Request $request, Order $order)
    {
        return new OrderResource($order);
    }

    /**
     * @param \App\Http\Requests\OrderUpdateRequest $request
     * @param \App\Models\Order $order
     * @return \App\Http\Resources\OrderResource
     */
    public function update(OrderUpdateRequest $request, Order $order)
    {
        $order->update($request->validated());

        return new OrderResource($order);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Order $order
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Order $order)
    {
        $order->delete();

        return response()->noContent();
    }

    public function export(Request $request)
    {
        $cols = ['id','created_at','user.name','user.email','user.phone_number','total','payment_status'];
        $headers = ['OrderID','date','Name','Email','Phone Number','total','payment_status'];
        $total=['total'];
        return $this->commonDataExporter('Order', $cols, $headers,$total);
    }
}
