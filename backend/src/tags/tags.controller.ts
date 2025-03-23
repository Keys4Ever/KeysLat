import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto, UpdateTagDto } from 'src/dto/tag.dto';
import { correctResponse, incorrectResponse } from 'src/utils/buildResponse';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @Post()
    async createTag(@Body() createTagDto: CreateTagDto) {
        const result = await this.tagsService.createTag(createTagDto);
        if(!result){
            return incorrectResponse('Oops, something happened!');
        }
        return correctResponse('Tag created', result);
    }

    @Get()
    async findAll(@Query() query: any) {
        const result = await this.tagsService.findAll(query.user_id);
        if(!result){
            return incorrectResponse('No tags found for user');
        }
        return correctResponse('Tags found', result);
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        const result = await this.tagsService.findOne(id);
        if(!result){
            return incorrectResponse('Tag not found');
        }
        return correctResponse('Tag found', result);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateTagDto: UpdateTagDto) {
        const result = await this.tagsService.update(id, updateTagDto);
        if(!result){
            return incorrectResponse('Tag not found');
        }
        return correctResponse('Tag updated', result);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        const result = await this.tagsService.delete(id);
        if(!result){
            return incorrectResponse('Tag not found');
        }
        return correctResponse('Tag deleted');
    }

    @Post(':tagId/urls/:urlId')
    async addTagToUrl(@Param('tagId') tagId: number, @Param('urlId') urlId: number) {
        const result = await this.tagsService.addTagToUrl(tagId, urlId);
        if(!result){
            return incorrectResponse('Tag not found');
        }
        return correctResponse('Tag added to URL', result);
    }
}
