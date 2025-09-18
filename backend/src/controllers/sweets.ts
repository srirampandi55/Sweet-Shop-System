import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/db';
import { SweetSchema } from '../utils/validation';
import { createError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

export const getAllSweets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sweets = await prisma.sweet.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const response: ApiResponse = {
      success: true,
      data: { sweets },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getSweetById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const sweet = await prisma.sweet.findUnique({
      where: { id },
    });

    if (!sweet) {
      throw createError('Sweet not found', 404);
    }

    const response: ApiResponse = {
      success: true,
      data: { sweet },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const createSweet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = SweetSchema.parse(req.body);

    const sweet = await prisma.sweet.create({
      data,
    });

    const response: ApiResponse = {
      success: true,
      data: { sweet },
      message: 'Sweet created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateSweet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = SweetSchema.partial().parse(req.body);

    const existingSweet = await prisma.sweet.findUnique({
      where: { id },
    });

    if (!existingSweet) {
      throw createError('Sweet not found', 404);
    }

    const sweet = await prisma.sweet.update({
      where: { id },
      data,
    });

    const response: ApiResponse = {
      success: true,
      data: { sweet },
      message: 'Sweet updated successfully',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteSweet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existingSweet = await prisma.sweet.findUnique({
      where: { id },
    });

    if (!existingSweet) {
      throw createError('Sweet not found', 404);
    }

    await prisma.sweet.delete({
      where: { id },
    });

    const response: ApiResponse = {
      success: true,
      message: 'Sweet deleted successfully',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};
