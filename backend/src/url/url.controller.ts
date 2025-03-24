import { Controller, Post, Get, Delete, Put, Param, Body, Query, BadRequestException } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto, UpdateUrlDto } from 'src/dto/url.dto';
import { Url } from 'src/entities/url.entity';
import { TagsService } from 'src/tags/tags.service';
import { RedisService } from 'src/redis/redis.service';
import { ApiResponse } from 'src/shared/interfaces/api.interface';
import { correctResponse, incorrectResponse } from 'src/utils/buildResponse';
import { StatsService } from 'src/stats/stats.service';
import { QuickUrlService } from 'src/quick-url/quick-url.service';

@Controller('url')
export class UrlController {
    constructor(
        private readonly urlService: UrlService,
        private readonly tagsService: TagsService,
        private readonly redisService: RedisService,
        private readonly statsService: StatsService,
        private readonly quickUrlService: QuickUrlService
    ) {}

    @Post('/create')
    async create(@Body() urlDto: CreateUrlDto, @Query('user_id') userId: string): Promise<ApiResponse<Url>> {
        urlDto.user_id = userId;
        const url = await this.urlService.create(urlDto);
        if(!url){
            return incorrectResponse('Oops, something happened!');
        }
        return correctResponse('URL created', url);
    }

    @Get('/all')
    async findAll(@Query('user_id') userId: string): Promise<ApiResponse<Url[]>> {
        const urls = await this.urlService.findAll(userId);
        if(!urls){
            return incorrectResponse('URLs not found');
        }
        return correctResponse('URLs found', urls);
    }

    @Get('/:urlId')
    async getOne(@Param('urlId') urlId: number): Promise<ApiResponse<Url>> {
        const url = await this.urlService.getOne(urlId);
        if (!url) {
            return incorrectResponse('URL not found');
        }
        return correctResponse('URL found', url);
    }

    @Put('/:urlId')
    async update(@Param('urlId') urlId: number, @Body() updateData: UpdateUrlDto): Promise<ApiResponse<Url>> {
        if(updateData.current_original_url == updateData.new_original_url && updateData.current_short_url == updateData.new_short_url && updateData.description == updateData.new_description && updateData.tags == updateData.new_tags) {
            throw new BadRequestException('No changes detected');
        }

        const updateUrlData: Partial<Url> = {
            original_url: updateData.new_original_url,
            short_url: updateData.new_short_url,
            description: updateData.new_description
        };

        if (updateData.new_tags) {
            const tags = await this.tagsService.findByIds(updateData.new_tags);
            updateUrlData.tags = tags;
        }

        return correctResponse('URL updated', await this.urlService.update(urlId, updateUrlData));
    }

    @Delete('/:urlId')
    async delete(@Param('urlId') urlId: number): Promise<ApiResponse<void>> {
        const response = await this.urlService.delete(urlId);
        if (!response) {
            return incorrectResponse('URL not found');
        }
        return correctResponse('URL deleted');
    }

    @Get(':shortUrl')
    async getOnlyOriginalUrl(@Param('shortUrl') shortUrl: string): Promise<ApiResponse<string>> {
        let original_url = "";
        original_url = await this.redisService.getOriginalUrl(shortUrl);
        if (!original_url) {
            original_url = await this.urlService.getOnlyOriginalUrl(shortUrl);
            if (!original_url) {
                return incorrectResponse('URL not found');
            }
            await this.redisService.setUrl(shortUrl, original_url, 999999);
        }

        const urlId = await this.urlService.getOnlyId(shortUrl);
        
        await this.statsService.updateClicks(urlId);

        return correctResponse('URL found', original_url);
    }

    @Post('quick-short')
    async createQuickShort(@Body('longUrl') longUrl: string): Promise<ApiResponse<{ shortUrl: string; secretKey: string }>> {
      try {
        const result = await this.quickUrlService.createQuickUrl(longUrl);
        return result;
      } catch (error) {
        return incorrectResponse('Error creating quick URL');
      }
    }
}

