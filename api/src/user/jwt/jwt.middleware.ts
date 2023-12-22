import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload, AuthenticatedRequest } from '../interfaces/interface.interface';
import { NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(new UnauthorizedException('No token provided'));
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user: JwtPayload) => {
      if (err) {
        console.log(err);
        return next(new UnauthorizedException('Invalid token'));
      }
      req.user = user;
      next();
    });
  }
}
