import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from 'src/dto/user.dto';
import { correctResponse, incorrectResponse } from 'src/utils/buildResponse';
import { ApiResponse } from 'src/shared/interfaces/api.interface';
import { QuickUrlService } from 'src/quick-url/quick-url.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly quickUrlService: QuickUrlService) {}

    @Get('/:id')
    async findOne(@Param('id') id: string, @Query('user_id') userId: string): Promise<ApiResponse<User>> {
        if (userId !== id) {
            return incorrectResponse('Unauthorized');
        }
        const result = await this.usersService.findOne(id);
        if(!result){
            return incorrectResponse('User not found');
        }
        return correctResponse('User found', result);
    }

    @Put('/:id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Query('user_id') userId: string): Promise<ApiResponse<User>> {
        if (userId !== id) {
            return incorrectResponse('Unauthorized');
        }
        const result = await this.usersService.update(id, updateUserDto);
        if(!result){
            return incorrectResponse('User not found');
        }
        return correctResponse('User updated', result);
    }

    @Delete('/:id')
    async delete(@Param('id') id: string, @Query('user_id') userId: string): Promise<ApiResponse<boolean>> {
        if (userId !== id) {
            return incorrectResponse('Unauthorized');
        }
        const result = await this.usersService.delete(id);
        if(!result){
            return incorrectResponse('User not found');
        }
        return correctResponse('User deleted');
    }

    @Post('add-secret')
    async addSecret(@Query('user_id') user_id: string, @Body('secretKey') secretKey: string): Promise<ApiResponse<any>> {
      try {
        const result = await this.quickUrlService.connectQuickUrl(user_id, secretKey);
        return result;
      } catch (error) {
        return incorrectResponse('Error associating secret key');
      }
    }
}   
