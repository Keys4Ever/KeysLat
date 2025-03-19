import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super_secret_key',
      passReqToCallback: true,
    });
  }
 
  async validate(req: Request, payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    
    if (this.authService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token has been invalidated');
    }
  
    return { userId: payload.sub, username: payload.username };
  }
}