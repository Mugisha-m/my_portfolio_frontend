import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export type AuthUser = {
  id: string;
  email: string;
  role: "ADMIN" | "EDITOR";
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    req.user = jwt.verify(token, config.jwtSecret) as AuthUser;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(...roles: AuthUser["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    return next();
  };
}
