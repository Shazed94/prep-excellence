import type { Request, Response } from "express";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";

export const getOrCreateCart = asyncHandler(
	async (req: Request, res: Response) => {
		const userId = req.user?.id;
		if (!userId) {
			throw new AppError("User profile not found", 404);
		}

		const cart = await prisma.cart.findUnique({
			where: { userId },
			include: {
				items: {
					include: {
						course: { select: { title: true } },
					},
				},
			},
		});

		if (!cart) {
			const newCart = await prisma.cart.create({
				data: { userId },
				include: {
					items: {
						include: {
							course: { select: { title: true } },
						},
					},
				},
			});
			return res.status(201).json({
				success: true,
				data: newCart,
				message: "Cart created successfully",
			});
		}

		return res.status(200).json({
			success: true,
			data: cart,
			message: "Cart fetched successfully",
		});
	},
);

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
	const { courseId } = req.body;
	const userId = req.user?.id;

	if (!userId || !courseId) {
		throw new AppError("userId and courseId are required", 400);
	}

	const cart = await prisma.cart.upsert({
		where: { userId },
		create: { userId },
		update: {},
	});

	const item = await prisma.cartItem.upsert({
		where: {
			cartId_courseId: {
				cartId: cart.id,
				courseId,
			},
		},
		create: {
			cartId: cart.id,
			courseId,
			quantity: 1,
		},
		update: {
			quantity: { increment: 1 },
		},
		include: {
			course: true,
		},
	});

	return res.status(200).json({
		success: true,
		data: item,
		message: "Item added to cart successfully",
	});
});

export const clearCartItems = asyncHandler(
	async (req: Request, res: Response) => {
		const userId = req.user?.id;
		if (!userId) {
			throw new AppError("User profile not found", 404);
		}

		const cart = await prisma.cart.findUnique({
			where: { userId },
		});

		if (!cart) {
			throw new AppError("Cart not found", 404);
		}

		await prisma.cartItem.deleteMany({
			where: { cartId: cart.id },
		});

		return res.status(200).json({
			success: true,
			message: "All items removed from cart successfully",
		});
	},
);
