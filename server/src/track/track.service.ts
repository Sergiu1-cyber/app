import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {FileService, FileType} from 'src/file/file.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Track, TrackDocument } from './schemas/track.schema';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
		private fileService: FileService,
  ) {}

  async create(createTrackDto: CreateTrackDto, picture, audio): Promise<Track> {
		const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
		const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const track = new this.trackModel({
      ...createTrackDto,
      listens: 0,
			audio: audioPath,
			picture: picturePath,
    });
    return track.save();
  }

  async findAll(): Promise<Track[]> {
    return this.trackModel.find().exec();
  }

  async findOne(id: ObjectId): Promise<Track> {
    return this.trackModel.findById(id).populate('comments');
  }

  async remove(id: ObjectId): Promise<Track> {
    return this.trackModel.findByIdAndDelete(id);
  }

  async addComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const track = await this.trackModel.findById(createCommentDto.trackId);
    const comment = new this.commentModel(createCommentDto);
    track.comments.push(comment._id);
    await comment.save();
    await track.save();
    return comment;
  }
}
