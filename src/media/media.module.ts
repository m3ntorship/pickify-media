import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterConfigService } from 'src/config/multer';

import { MediaRepository } from './entities/media.repository';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaRepository]),
    MulterModule.registerAsync({ useClass: MulterConfigService }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
