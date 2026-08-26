import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ENV } from '../config/env';
import User, { IUserDocument } from '../models/User';

export interface AuthRequest<P = Record<string, string>, ResBody = unknown, ReqBody = unknown, ReqQuery = unknown>
  extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: IUserDocument;
}

interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for Bearer token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        message: 'Not authorized, no token provided',
      });
      return;
    }

    // Verify token signature and expiration
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as DecodedToken;

    // Find user in DB (password is excluded automatically)
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({
        message: 'Not authorized, user not found',
      });
      return;
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Not authorized, token invalid or expired',
    });
  }
};

// Middleware to authorize specific roles (e.g. 'admin')
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        message: 'Not authorized, authentication required',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        message: `Forbidden: '${req.user.role}' role does not have access to this resource`,
      });
      return;
    }

    next();
  };
};
