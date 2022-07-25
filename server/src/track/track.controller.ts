import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { ObjectId } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
      { name: 'picture', maxCount:1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  create(
    @Body() createTrackDto: CreateTrackDto,
    @UploadedFiles()
    files: { picture?: Express.Multer.File[], audio?: Express.Multer.File[] },
  ) {
		const {picture, audio} = files;
    return this.trackService.create(createTrackDto, picture[0], audio[0]);
  }

  @Get()
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: ObjectId) {
    return this.trackService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: ObjectId) {
    return this.trackService.remove(id);
  }

  @Post('/comment')
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.trackService.addComment(createCommentDto);
  }
}
