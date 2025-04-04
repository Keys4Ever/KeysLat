import type { JwtPayload } from '../api/auth/entity';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
