import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/db';
import { OrderSchema } from '../utils/validation';
import { createError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            sweet: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const response: ApiResponse = {
      success: true,
      data: { orders },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            sweet: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw createError('Order not found', 404);
    }

    const response: ApiResponse = {
      success: true,
      data: { order },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerName, items } = OrderSchema.parse(req.body);

    // Validate sweets exist and have enough stock
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const sweet = await prisma.sweet.findUnique({
        where: { id: item.sweetId },
      });

      if (!sweet) {
        throw createError(`Sweet with ID ${item.sweetId} not found`, 404);
      }

      if (sweet.stock < item.quantity) {
        throw createError(`Insufficient stock for ${sweet.name}. Available: ${sweet.stock}`, 400);
      }

      const itemTotal = sweet.price * item.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        sweetId: item.sweetId,
        quantity: item.quantity,
        price: itemTotal,
      });
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        customerName,
        totalPrice,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            sweet: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Update stock for each sweet
    for (const item of items) {
      await prisma.sweet.update({
        where: { id: item.sweetId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    const response: ApiResponse = {
      success: true,
      data: { order },
      message: 'Order placed successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw createError('Order not found', 404);
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        updatedAt: new Date(),
      },
      include: {
        items: {
          include: {
            sweet: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const response: ApiResponse = {
      success: true,
      data: { order },
      message: 'Order updated successfully',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};
