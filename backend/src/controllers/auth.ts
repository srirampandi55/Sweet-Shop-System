import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/db';
import { generateToken } from '../utils/jwt';
import { LoginSchema, RegisterSchema } from '../utils/validation';
import { createError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

export const register = async (req: Request, res: Response, next: NextFunction) => {
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
    });

    // Generate token
    const token = generateToken(user);

    const response: ApiResponse = {
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        token,
      },
      message: 'User registered successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = LoginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw createError('Invalid credentials', 401);
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw createError('Invalid credentials', 401);
    }

    // Generate token
    const token = generateToken(user);

    const response: ApiResponse = {
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        token,
      },
      message: 'Login successful',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
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
