import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ShoppingCart, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import FooterTwo from "@/components/FooterTwo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";

export const Route = createFileRoute("/cart")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const {
		items: cartItems,
		isLoading,
		removeItem,
		clearCart,
		subtotal,
		discount,
		total,
		itemCount,
	} = useCart();

	const handleRemoveItem = (courseId: string, title: string) => {
		removeItem(courseId, {
			onSuccess: (res: { message?: string }) => {
				toast.success(res.message || `"${title}" removed from cart`);
				queryClient.invalidateQueries({ queryKey: ["cart"] });
			},
		});
	};

	const handleClearCart = () => {
		clearCart(undefined, {
			onSuccess: (res: { message?: string }) => {
				toast.success(res.message || "All items removed from cart");
				queryClient.invalidateQueries({ queryKey: ["cart"] });
			},
		});
	};

	const handleCheckout = () => {
		navigate({ to: "/checkout" });
	};

	return (
		<div>
			<div className="container mx-auto px-4 md:px-0 py-4">
				<div className="flex justify-between items-center">
					<Link to="/" className="flex items-center gap-2">
						<img src="logo.png" alt="" />
					</Link>
					<div className="flex items-center gap-3.5">
						<div className="flex items-center gap-2.5 bg-[#EEFCF5] px-4 md:px-7 py-3.5 rounded-sm">
							<img src="/icons/security-check.png" alt="" />
							<span className="text-[#1BA75C] text-sm md:text-base">
								100% Secure Payment
							</span>
						</div>
						<button
							type="button"
							onClick={() => window.history.back()}
							className="p-1.5 md:p-2.5 border border-[#EBEBEB] rounded-sm cursor-pointer"
						>
							<X />
						</button>
					</div>
				</div>
			</div>
			{/* Page Banner */}
			<section className="bg-linear-to-b from-primary/5 to-background py-8 md:py-12">
				<div className="container mx-auto px-4 md:px-6">
					<div className="flex flex-col items-center text-center gap-3">
						<ShoppingCart className="size-10 text-primary" />
						<h1 className="text-3xl md:text-4xl font-bold text-foreground">
							Shopping Cart
						</h1>
						<p className="text-muted-foreground text-base max-w-lg">
							Review your selected courses and proceed to checkout when you're
							ready.
						</p>
					</div>
				</div>
			</section>

			{/* Cart Content */}
			<section className="container mx-auto px-4 md:px-6 py-4 md:py-10">
				{isLoading ? (
					<div className="flex items-center justify-center py-20">
						<div className="flex flex-col items-center gap-3">
							<div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
							<p className="text-muted-foreground text-sm">Loading cart...</p>
						</div>
					</div>
				) : cartItems.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 gap-6">
						<div className="size-24 rounded-full bg-muted flex items-center justify-center">
							<ShoppingCart className="size-12 text-muted-foreground opacity-50" />
						</div>
						<div className="text-center">
							<h2 className="text-xl font-semibold text-foreground mb-2">
								Your cart is empty
							</h2>
							<p className="text-muted-foreground mb-6 max-w-md">
								Looks like you haven't added any courses yet. Browse our catalog
								and find the perfect course for you!
							</p>
							<Button asChild>
								<Link to="/">
									<ArrowLeft className="size-4 mr-2" />
									Continue Shopping
								</Link>
							</Button>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Cart Items - Left Side */}
						<div className="lg:col-span-2 space-y-4">
							{/* Header row */}
							<div className="hidden md:flex items-center px-4 py-3 bg-muted/30 rounded-lg text-sm font-medium text-muted-foreground">
								<div className="flex-1">Product</div>
								<div className="w-24 text-center">Price</div>
								<div className="w-24 text-center">Total</div>
								<div className="w-16" />
							</div>

							{cartItems.map((item: any) => (
								<div
									key={item.courseId}
									className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-lg border border-border bg-card hover:shadow-sm transition-shadow"
								>
									{/* Product Info */}
									<div className="flex-1 flex items-center gap-4 w-full md:w-auto">
										{item.course.thumbnail && (
											<div className="size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
												<img
													src={item.course.thumbnail}
													alt={item.course.title}
													className="size-full object-cover"
												/>
											</div>
										)}
										<div className="min-w-0 flex-1">
											<h3 className="font-semibold text-foreground truncate">
												{item.course.title}
											</h3>
											{item.course.discount > 0 && (
												<p className="text-xs text-muted-foreground mt-0.5">
													You save ${item.course.discount}
												</p>
											)}
										</div>
									</div>

									{/* Price */}
									<div className="flex md:flex-col items-baseline md:items-center gap-2 md:gap-0 w-full md:w-24">
										<span className="md:hidden text-sm text-muted-foreground">
											Price:
										</span>
										<div className="flex items-baseline gap-1.5">
											<span className="font-bold text-primary">
												${item.course?.price - item.course?.discount}
											</span>
											{item.course?.discount > 0 && (
												<span className="text-xs text-muted-foreground line-through">
													${item.course?.price}
												</span>
											)}
										</div>
									</div>

									{/* Total */}
									<div className="flex md:flex-col items-baseline md:items-center gap-2 md:gap-0 w-full md:w-24">
										<span className="md:hidden text-sm text-muted-foreground">
											Total:
										</span>
										<span className="font-semibold text-foreground">
											$
											{(item.course?.price - item.course?.discount) *
												(item.quantity || 1)}
										</span>
									</div>

									{/* Remove */}
									<div className="flex items-center gap-2 w-full md:w-16 md:justify-center">
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												handleRemoveItem(item.courseId, item.course.title)
											}
											className="text-destructive hover:bg-destructive/10 h-9 w-9 p-0"
											title={`Remove ${item.course.title}`}
										>
											<Trash2 className="size-4" />
											<span className="sr-only">
												Remove {item.course.title}
											</span>
										</Button>
									</div>
								</div>
							))}
						</div>

						{/* Cart Summary - Right Side */}
						<div className="lg:col-span-1">
							<div className="sticky top-24 rounded-xl border border-border bg-card p-6 space-y-4">
								<h2 className="text-lg font-semibold text-foreground">
									Order Summary
								</h2>

								<div className="space-y-3">
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">
											Items ({itemCount})
										</span>
										<span className="font-medium text-foreground">
											${subtotal}
										</span>
									</div>

									<Separator />

									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Subtotal</span>
										<span className="font-medium text-foreground">
											${subtotal}
										</span>
									</div>

									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Discount</span>
										<span className="font-medium text-green-600">
											- ${discount}
										</span>
									</div>

									<Separator />

									<div className="flex justify-between">
										<span className="font-semibold text-foreground">Total</span>
										<span className="text-xl font-bold text-primary">
											${total}
										</span>
									</div>
								</div>

								<div className="space-y-3 pt-2">
									<Button
										onClick={handleCheckout}
										disabled={isLoading || cartItems.length === 0}
										className="w-full gradient font-semibold"
										size="lg"
									>
										{isLoading ? "Processing..." : "Proceed to Checkout"}
									</Button>

									<Button
										variant="outline"
										onClick={handleClearCart}
										disabled={cartItems.length === 0}
										className="w-full border-border text-destructive hover:bg-destructive/10"
									>
										<Trash2 className="size-4 mr-2" />
										Clear Cart
									</Button>

									<Button
										variant="ghost"
										asChild
										className="w-full text-muted-foreground"
									>
										<Link to="/">
											<ArrowLeft className="size-4 mr-2" />
											Continue Shopping
										</Link>
									</Button>
								</div>
							</div>
						</div>
					</div>
				)}
			</section>
		</div>
	);
}
