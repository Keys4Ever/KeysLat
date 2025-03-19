import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/dto/user.dto';
import { AuthResponse } from 'src/shared/interfaces/auth.interfaces';
import { LoginDto } from 'src/shared/schemas/register.schema';
import { UsersService } from '../users/users.service';
import { AuthProvider } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
    private readonly blacklistedTokens: Set<string> = new Set();

    constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
    ) {}
  
    async register(registerDto: CreateUserDto): Promise<AuthResponse> {
      const existingUser = await this.usersService.findOne(registerDto.username);
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
  
      const user = await this.usersService.create(registerDto);
      const payload = { username: user.username, sub: user.user_id };
      const access_token = this.jwtService.sign(payload);
  
      return {
        success: true,
        message: 'Registration successful',
        data: {
          access_token,
          user: {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            profile_picture: user.profile_picture
          }
        }
      };
    }
  
    async validateUser(username: string, password: string): Promise<any> {
      const user = await this.usersService.findOne(username);
      if (user && await user.validatePassword(password)) {
        return { id: user.user_id , username: user.username };
      }
      return null;
    }
  
    async validateGithubUser(profile: { githubId: string; username: string; email?: string }) {
      let user = await this.usersService.findByProviderId(profile.githubId);
      
      if (!user) {
        user = await this.usersService.createGithubUser({
          username: profile.username,
          githubId: profile.githubId,
          email: profile.email,
        });
      }

      const payload = { username: user.username, sub: user.user_id };
      const access_token = this.jwtService.sign(payload);

      return {
        success: true,
        message: 'GitHub authentication successful',
        data: {
          access_token,
          user: {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            profile_picture: user.profile_picture
          }
        }
      };
    }
  
    async login(userData: any): Promise<AuthResponse> {
      const payload = { username: userData.username, sub: userData.id };
      return {
        success: true,
        message: 'Login successful',
        data: {
          access_token: this.jwtService.sign(payload),
          user: {
            user_id: userData.id,
            username: userData.username,
            email: userData.email,
            profile_picture: userData.profile_picture
          }
        }
      };
    }
  
    async logout(token: string): Promise<AuthResponse> {
      this.blacklistedTokens.add(token);
      return {
        success: true,
        message: 'Logout successful'
      };
    }
  
    isTokenBlacklisted(token: string): boolean {
      return this.blacklistedTokens.has(token);
    }

    async findOrCreateProviderUser(userData: {
      providerId: string;
      provider: AuthProvider;
      email?: string;
      username?: string;
      profilePicture?: string;
    }): Promise<any> {
      let user = await this.usersService.findByProviderId(userData.providerId);
      
      if (!user && userData.email) {
        user = await this.usersService.findByEmail(userData.email);
        
        if (user) {
          user = await this.usersService.update(user.user_id, {
            provider_id: userData.providerId,
            auth_provider: userData.provider,
            ...((!user.profile_picture && userData.profilePicture) ? 
                { profile_picture: userData.profilePicture } : {})
          });
        }
      }
      
      if (!user) {
        const newUser = {
          user_id: Math.floor(Math.random() * Date.now()).toString(),
          email: userData.email || `${userData.username}@${userData.provider.toLowerCase()}.com`,
          username: userData.username,
          provider_id: userData.providerId,
          auth_provider: userData.provider,
          profile_picture: userData.profilePicture,
        };
        
        user = await this.usersService.create(newUser as CreateUserDto);
      }
      
      const token = this.generateToken(user);
      
      return {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        profile_picture: user.profile_picture,
        access_token: token
      };
    }
    
    private generateToken(user: any): string {
      const payload = { username: user.username, sub: user.user_id };
      return this.jwtService.sign(payload);
    }
}