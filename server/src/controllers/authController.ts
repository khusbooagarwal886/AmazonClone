import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import User from '../models/User';
import { ENV } from '../config/env';
import { RegisterInput, LoginInput } from '../validators/authValidators';

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
export const register = async (
  req: Request<Record<string, never>, Record<string, never>, RegisterInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        message: 'A user with this email already exists',
      });
      return;
    }

    // Create new user (password is automatically hashed via User schema pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
    });

    // Return response (no token yet, as per step 3.6)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get JWT token
// @access  Public
export const login = async (
  req: Request<Record<string, never>, Record<string, never>, LoginInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;


    // Find user by email and explicitly include password (due to select: false on schema)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        message: 'Invalid email or password',
      });
      return;
    }

    // Verify password with bcrypt
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        message: 'Invalid email or password',
      });
      return;
    }

    // Generate JWT token (payload: minimal, non-sensitive identifier)
    const signOptions: SignOptions = {
      expiresIn: ENV.JWT_EXPIRES_IN as unknown as number,
    };

    const token = jwt.sign(
      { id: user._id, role: user.role },
      ENV.JWT_SECRET as Secret,
      signOptions
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
