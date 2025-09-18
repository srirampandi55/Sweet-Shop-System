import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/db';
import { RegisterSchema, UpdateUserSchema } from '../utils/validation';
import { createError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const response: ApiResponse = {
      success: true,
      data: { users },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    const response: ApiResponse = {
      success: true,
      data: { user },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, role = 'STAFF' } = RegisterSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw createError('Username already exists', 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role,
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    const response: ApiResponse = {
      success: true,
      data: { user },
      message: 'User created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = UpdateUserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw createError('User not found', 404);
    }

    // Check if username is being updated and is unique
    if (updates.username && updates.username !== existingUser.username) {
      const userWithUsername = await prisma.user.findUnique({
        where: { username: updates.username },
      });

      if (userWithUsername) {
        throw createError('Username already exists', 400);
      }
    }

    // Hash password if being updated
    const updateData: any = { ...updates };
    if (updates.password) {
      updateData.passwordHash = await bcrypt.hash(updates.password, 12);
      delete updateData.password;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        role: true,
        updatedAt: true,
      },
    });

    const response: ApiResponse = {
      success: true,
      data: { user },
      message: 'User updated successfully',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const currentUserId = (req as any).user.userId;

    if (id === currentUserId) {
      throw createError('Cannot delete your own account', 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw createError('User not found', 404);
    }

    await prisma.user.delete({
      where: { id },
    });

    const response: ApiResponse = {
      success: true,
      message: 'User deleted successfully',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};
