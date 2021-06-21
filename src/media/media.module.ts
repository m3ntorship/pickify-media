import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
    ClientsModule.registerAsync([
      {
        name: 'MEDIA_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          name: 'MEDIA_SERVICE',
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('rabbitURL') as string],
            queue: 'media_queue',
            // to ensure the message will not be deleted until a consumer sends an ack
            noAck: false,
            queueOptions: {
              // the queue will survive broker restarts
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
