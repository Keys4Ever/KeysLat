import { Controller, Post, Get, Delete, Put, Param, Body, Query } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from 'src/dto/url.dto';
import { Url } from 'src/entities/url.entity';

@Controller('url')
export class UrlController {
    constructor(private readonly urlService: UrlService) {}

    @Post('/create')
    async create(@Body() urlDto: CreateUrlDto): Promise<Url> {
        return this.urlService.create(urlDto);
    }

    @Get('/all')
    async findAll(@Query('userId') userId: string): Promise<Url[]> {
        return this.urlService.findAll(userId);
    }

    @Get('/:urlId')
    async getOne(@Param('urlId') urlId: number): Promise<Url | undefined> {
        return this.urlService.getOne(urlId);
    }

    @Put(':idurlId')
    async update(@Param('urlId') urlId: number, @Body() updateData: Partial<Url>): Promise<Url> {
        return this.urlService.update(urlId, updateData);
    }

    @Delete('/:urlId')
    async delete(@Param('urlId') urlId: number): Promise<void> {
        return this.urlService.delete(urlId);
    }

    @Get(':shortUrl')
    async getOnlyOriginalUrl(@Param('shortUrl') shortUrl: string): Promise<string | undefined> {
        // TODO implement redis caching
        return this.urlService.getOnlyOriginalUrl(shortUrl);
    }
}
