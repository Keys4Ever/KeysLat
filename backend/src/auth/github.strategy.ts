import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from './auth.service';
import { AuthProvider } from './auth-provider.enum';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    try {
      // Utiliza los métodos existentes del servicio de autenticación
      const user = await this.authService.findOrCreateProviderUser({
        providerId: profile.id,
        provider: AuthProvider.GITHUB,
        email: profile.emails[0]?.value,
        username: profile.username || profile.displayName,
        profilePicture: profile.photos[0]?.value,
      });
      
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
}