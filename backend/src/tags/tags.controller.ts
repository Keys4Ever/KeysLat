import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto, UpdateTagDto } from 'src/dto/tag.dto';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @Post()
    async createTag(@Body() createTagDto: CreateTagDto) {
        return await this.tagsService.createTag(createTagDto);
    }

    @Get()
    async findAll(@Query() query: any) {
        return await this.tagsService.findAll(query.user_id);
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return await this.tagsService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateTagDto: UpdateTagDto) {
        return await this.tagsService.update(id, updateTagDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return await this.tagsService.delete(id);
    }

    @Post(':tagId/urls/:urlId')
    async addTagToUrl(@Param('tagId') tagId: number, @Param('urlId') urlId: number) {
        return await this.tagsService.addTagToUrl(tagId, urlId);
    }
}
