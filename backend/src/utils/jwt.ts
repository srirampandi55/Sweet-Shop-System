import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { User } from '@prisma/client';

export interface JWTPayload {
  userId: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const generateToken = (user: User): string => {
  // Use Record<string, any> to satisfy jwt.sign payload type
  const payload: Record<string, any> = {
    userId: user.id,
    username: user.username,
    role: user.role,
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    // Type guard to ensure the decoded token has required properties
    if (
      decoded &&
      typeof decoded === 'object' &&
      typeof decoded.userId === 'string' &&
      typeof decoded.username === 'string' &&
      typeof decoded.role === 'string'
    ) {
      return {
        userId: decoded.userId,
        username: decoded.username,
        role: decoded.role,
        iat: decoded.iat,
        exp: decoded.exp,
      };
    }
    
    throw new Error('Invalid token payload structure');
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    if (error instanceof jwt.NotBeforeError) {
      throw new Error('Token not active');
    }
    throw new Error('Token verification failed');
  }
};

export const refreshToken = (token: string): string => {
  try {
    const decoded = verifyToken(token);
    
    // Create new token with same payload but fresh expiration
    const payload: Record<string, any> = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
    };
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    
    const options: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
    };
    
    return jwt.sign(payload, secret, options);
  } catch (error) {
    throw new Error('Failed to refresh token');
  }
};

export const getTokenPayload = (token: string): JWTPayload | null => {
  try {
    return verifyToken(token);
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = getTokenPayload(token);
    if (!payload || !payload.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const decodeTokenWithoutVerification = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    
    if (
      decoded &&
      typeof decoded === 'object' &&
      typeof decoded.userId === 'string' &&
      typeof decoded.username === 'string' &&
      typeof decoded.role === 'string'
    ) {
      return {
        userId: decoded.userId,
        username: decoded.username,
        role: decoded.role,
        iat: decoded.iat,
        exp: decoded.exp,
      };
    }
    
    return null;
  } catch (error) {
    return null;
  }
};
