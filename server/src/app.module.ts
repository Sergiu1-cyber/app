import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {FileModule} from './file/file.module';
import { TrackModule } from './track/track.module';

@Module({
  imports: [
    TrackModule,
    MongooseModule.forRoot(
      'mongodb+srv://sergiu1:01superman@cluster0.qwpf1.mongodb.net/music?retryWrites=true&w=majority',
    ),
		FileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
