import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/user.dto';
import { UpdateUserDto } from '../dto/user.dto';
import { AuthProvider } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ 
      where: { username } 
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ 
      where: { email } 
    });
  }

  async findByProviderId(providerId: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ 
      where: { provider_id: providerId } 
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async createGithubUser(githubUser: {
    username: string;
    githubId: string;
    email?: string;
  }): Promise<User> {
    const user = this.usersRepository.create({
      user_id: Math.floor(Math.random() * Date.now()).toString(),
      username: githubUser.username,
      email: githubUser.email || `${githubUser.username}@github.com`,
      provider_id: githubUser.githubId,
      auth_provider: AuthProvider.GITHUB,
    });
    return this.usersRepository.save(user);
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { user_id: userId } 
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async delete(userId: string): Promise<void> {
    const result = await this.usersRepository.delete(userId);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async getUserWithRelations(userId: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { user_id: userId },
      relations: ['urls', 'tags'],
    });
  }
}