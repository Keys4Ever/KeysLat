import { Controller, Post, Body, UseGuards, Get, UnauthorizedException, Req, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthResponse } from '../shared/interfaces/auth.interfaces';
import { registerSchema, loginSchema } from '../shared/schemas/auth.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: unknown): Promise<AuthResponse> {
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      throw new UnauthorizedException(result.error.errors[0].message);
    }
    return await this.authService.register(result.data);
  }

  @Post('login')
  async login(@Body() body: unknown): Promise<AuthResponse> {
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      throw new UnauthorizedException(result.error.errors[0].message);
    }

    const user = await this.authService.validateUser(
      result.data.username, 
      result.data.password
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Pasamos los datos del usuario validado, no el DTO de login
    return this.authService.login(user);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Headers('authorization') auth: string): Promise<AuthResponse> {
    if (!auth) {
      throw new UnauthorizedException('Authorization header is required');
    }
    const token = auth.replace('Bearer ', '');
    return this.authService.logout(token);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req): Promise<AuthResponse> {
    return {
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: req.user
      }
    };
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubAuthCallback(@Req() req): AuthResponse {
    return {
      success: true,
      message: 'GitHub authentication successful',
      data: {
        access_token: req.user.access_token,
        user: {
          user_id: req.user.user_id,
          username: req.user.username,
          email: req.user.email,
          profile_picture: req.user.profile_picture
        }
      }
    };
  }
}

