import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { type CartItem, useCart } from "@/hooks/useCart";

interface CartDrawerProps {
	items?: CartItem[];
	onRemove?: (courseId: string) => void;
	onQuantityChange?: (courseId: string, quantity: number) => void;
	onCheckout?: () => void;
	loading?: boolean;
}

export const CartDrawer = React.forwardRef<HTMLDivElement, CartDrawerProps>(
	(_, ref) => {
		const navigate = useNavigate();
		const [open, setOpen] = React.useState(false);
		const queryClient = useQueryClient();
		const { items: cartItems, isLoading, removeItem, clearCart } = useCart();

		const subtotal = cartItems.reduce(
			(sum: number, item: CartItem) =>
				sum + (item.course.offer_price || item.course.regular_price) * 1,
			0,
		);

		const handleCheckout = () => {
			navigate({ to: "/checkout" });
		};

		return (
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						size="default"
						className="relative h-11 bg-primary/10 hover:bg-primary/20 hover:ring-2 ring-primary/80 focus-visible:ring-primary/50 data-[state=open]:bg-transparent cursor-pointer"
						aria-label="Open cart"
					>
						<ShoppingCart className=" size-6! text-primary" />
						{cartItems.length > 0 && (
							<span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
								{cartItems.length}
							</span>
						)}
					</Button>
				</SheetTrigger>

				<SheetContent
					side="right"
					className="w-full sm:w-96 bg-background flex flex-col gap-0 p-0 overflow-hidden"
				>
					<SheetHeader className="space-y-2 px-4 pt-4">
						<div className="flex items-center justify-between">
							<SheetTitle className="text-2xl font-bold text-primary">
								Shopping Cart
							</SheetTitle>
						</div>
						<SheetDescription className="text-muted-foreground">
							{cartItems.length === 0
								? "Your cart is empty"
								: `${cartItems.length} item(s) in cart`}
						</SheetDescription>
					</SheetHeader>

					{cartItems.length === 0 ? (
						<div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
							<ShoppingCart className="h-12 w-12 text-muted-foreground opacity-50" />
							<div className="text-center">
								<p className="text-sm text-muted-foreground mb-4">
									Your cart is empty. Start shopping!
								</p>
							</div>
						</div>
					) : (
						<>
							<div className="flex-1 overflow-y-auto px-4 py-4">
								<div className="space-y-4">
									{cartItems.map((item: CartItem) => (
										<div
											key={item.courseId}
											className="flex gap-3 rounded-lg border border-border bg-card p-2 hover:shadow-sm transition-shadow"
										>
											{item.course.thumbnail && (
												<div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
													<img
														src={item.course.thumbnail}
														alt={item.course.title}
														className="h-full w-full object-cover"
													/>
												</div>
											)}

											<div className="flex-1 min-w-0">
												<h3 className="text-sm font-semibold text-foreground truncate">
													{item.course.title}
												</h3>

												<div className="mt-2 flex flex-wrap items-baseline gap-x-2">
													<span className="text-lg font-bold text-primary">
														$
														{item.course?.offer_price
															? item.course.offer_price
															: item.course?.regular_price}
													</span>
													{item.course?.offer_price && (
														<span className="text-sm font-medium text-muted-foreground line-through">
															${item.course?.regular_price}
														</span>
													)}
												</div>
											</div>

											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													removeItem(item.id, {
														onSuccess: (res) => {
															toast.success(
																res.message || "Item removed from cart",
															);
															queryClient.invalidateQueries({
																queryKey: ["cart"],
															});
														},
													})
												}
												className="shrink-0 self-start text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
											>
												<Trash2 className="h-4 w-4" />
												<span className="sr-only">
													Remove {item.course.title}
												</span>
											</Button>
										</div>
									))}
								</div>
							</div>

							<div className="px-4 pb-4">
								<Separator className="my-4" />

								<div className="space-y-3">
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Subtotal</span>
										<span className="font-medium text-foreground">
											${subtotal.toFixed(2)}
										</span>
									</div>

									<Separator className="my-2" />

									<div className="flex justify-between">
										<span className="font-semibold text-foreground">Total</span>
										<span className="text-xl font-bold text-primary">
											${subtotal.toFixed(2)}
										</span>
									</div>

									<div className="flex items-center gap-4">
										<Button
											onClick={handleCheckout}
											disabled={isLoading}
											className="flex-1 gradient font-semibold "
										>
											{isLoading ? "Processing..." : "Proceed to Checkout"}
										</Button>

										<Button
											variant="outline"
											onClick={() =>
												clearCart(undefined, {
													onSuccess: (res) => {
														toast.success(
															res.message || "All items removed from cart",
														);
														queryClient.invalidateQueries({
															queryKey: ["cart"],
														});
													},
												})
											}
											className="flex-1 border-border bg-destructive text-white hover:bg-destructive/80"
										>
											<Trash2 /> Clear Cart
										</Button>
									</div>

									<Button
										variant="outline"
										onClick={() => setOpen(false)}
										className="w-full border-border"
									>
										Continue Shopping
									</Button>
								</div>
							</div>
						</>
					)}
				</SheetContent>
			</Sheet>
		);
	},
);

CartDrawer.displayName = "CartDrawer";
