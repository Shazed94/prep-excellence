import type { Request, Response } from "express";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { toPublicUrl } from "@/utils/storageUrl";

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
            course: {
              select: {
                title: true,
                thumbnail: true,
                regular_price: true,
                offer_price: true,
              },
            },
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
      data: {
        ...cart,
        items: cart.items.map((item) => ({
          ...item,
          course: {
            ...item.course,
            thumbnail: item.course.thumbnail
              ? toPublicUrl(item.course.thumbnail)
              : null,
          },
        })),
      },
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
      quantity: 1,
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

export const removeCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const { itemId } = req.params;
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

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      throw new AppError("Cart item not found", 404);
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
    });
  },
);

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
