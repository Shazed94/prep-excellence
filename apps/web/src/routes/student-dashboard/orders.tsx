import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import {
	BookOpen,
	ChevronDown,
	ChevronUp,
	Loader2,
	Receipt,
	ShoppingBag,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGetMyOrders } from "@/hooks/order";

export const Route = createFileRoute("/student-dashboard/orders")({
	component: OrdersPage,
});

function statusColor(status: string) {
	const map: Record<string, string> = {
		PAID: "bg-emerald-100 text-emerald-700",
		PENDING: "bg-amber-100 text-amber-700",
		FAILED: "bg-red-100 text-red-600",
		REFUNDED: "bg-purple-100 text-purple-700",
		CANCELLED: "bg-muted/20 text-muted",
	};
	return map[status] ?? "bg-muted/20 text-muted";
}

function OrderCard({ order }: { order: any }) {
	const [open, setOpen] = useState(false);

	return (
		<div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
			<button
				type="button"
				onClick={() => setOpen((p) => !p)}
				className="w-full text-left p-4 hover:bg-muted/5 transition-colors"
			>
				<div className="flex items-center gap-4">
					<div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
						<Receipt size={16} className="text-primary" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="font-semibold text-sm">Order #{order.orderNumber}</p>
						<p className="text-xs text-muted mt-0.5">
							{format(new Date(order.createdAt), "MMM dd, yyyy")}
						</p>
					</div>
					<div className="flex items-center gap-3 shrink-0">
						<p className="font-bold text-sm text-foreground">
							৳{(order.total ?? order.total ?? 0).toLocaleString()}
						</p>
						<Badge
							className={`text-[10px] border-0 ${statusColor(order.status)}`}
						>
							{order.status}
						</Badge>
						{open ? (
							<ChevronUp size={15} className="text-muted" />
						) : (
							<ChevronDown size={15} className="text-muted" />
						)}
					</div>
				</div>
			</button>

			<AnimatePresence initial={false}>
				{open && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.22, ease: "easeInOut" }}
						className="overflow-hidden"
					>
						<Separator />
						<div className="p-4 space-y-3">
							{/* Items */}
							{order.items?.length > 0 ? (
								<div className="space-y-2">
									<p className="text-xs font-semibold text-muted uppercase tracking-wide">
										Items
									</p>
									{order.items.map((item: any, i: number) => (
										<div
											key={item.id ?? i}
											className="flex items-center gap-3 py-2 border-b last:border-0"
										>
											<div className="w-8 h-8 rounded-md bg-primary/8 flex items-center justify-center shrink-0">
												<BookOpen size={13} className="text-primary" />
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-xs font-medium truncate">
													{item.course?.title ??
														item.coachingCourse?.title ??
														"Course"}
												</p>
												<p className="text-[10px] text-muted">
													Qty: {item.quantity ?? 1}
												</p>
											</div>
											<p className="text-xs font-semibold shrink-0">
												৳{(item.unitPrice ?? 0).toLocaleString()}
											</p>
										</div>
									))}
								</div>
							) : null}

							{/* Billing summary */}
							<div className="bg-muted/8 rounded-lg p-3 space-y-1.5">
								{order.couponCode && (
									<div className="flex justify-between text-xs">
										<span className="text-muted">Coupon</span>
										<span className="text-emerald-600 font-medium">
											{order.couponCode}
										</span>
									</div>
								)}
								{order.discountAmount > 0 && (
									<div className="flex justify-between text-xs">
										<span className="text-muted">Discount</span>
										<span className="text-emerald-600">
											-৳{order.discountAmount?.toLocaleString()}
										</span>
									</div>
								)}
								<div className="flex justify-between text-sm font-bold pt-1 border-t">
									<span>Total Paid</span>
									<span className="text-primary">
										৳{(order.total ?? order.totalAmount ?? 0).toLocaleString()}
									</span>
								</div>
							</div>

							{/* Billing address */}
							{order.billing && (
								<div className="text-xs text-muted">
									<p className="font-medium text-foreground mb-0.5">
										Billing Address
									</p>
									<p>
										{order.billing.firstName} {order.billing.lastName}
									</p>
									<p>
										{order.billing.address}, {order.billing.city}
									</p>
									<p>{order.billing.email}</p>
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

function OrdersPage() {
	const { data: orders, isLoading } = useGetMyOrders();
	const orderList: any[] = Array.isArray(orders) ? orders : [];
	console.log("ordersssssss", orders);
	return (
		<div className="space-y-6 max-w-3xl">
			<div>
				<h1 className="text-xl font-switzer font-bold text-foreground">
					My Orders
				</h1>
				<p className="text-muted text-sm mt-0.5">Your purchase history</p>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-12">
					<Loader2 size={24} className="animate-spin text-primary" />
				</div>
			) : orderList.length === 0 ? (
				<div className="flex flex-col items-center py-16 text-muted gap-3">
					<ShoppingBag size={48} className="opacity-20" />
					<p className="text-sm">No orders yet</p>
				</div>
			) : (
				<div className="space-y-3">
					{orderList.map((order) => (
						<OrderCard key={order.id} order={order} />
					))}
				</div>
			)}
		</div>
	);
}
