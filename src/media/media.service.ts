import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { MediaUploadDTO } from './dto/mediaUpload.dto';
import { MediaRepository } from './entities/media.repository';

@Injectable()
export class MediaService {
  constructor(
    private mediaRepository: MediaRepository,
    @Inject('RABBITMQ_BROKER') private rabbitMQClient: ClientProxy,
    private configService: ConfigService,
  ) {}
  async uploadService(
    file: Express.Multer.File,
    uploadedData: MediaUploadDTO,
  ): Promise<void> {
    // check file
    if (!file) {
      throw new BadRequestException('File not found');
    }

    // add record for the file in db
    const createdFile = await this.mediaRepository.addFile(file);

    // send message with the added file uuid, entity_type, entity_id
    await this.rabbitMQClient
      .emit('added_media_data', {
        file_id: createdFile.uuid,
        entity_type: uploadedData.entity_type,
        entity_id: uploadedData.entity_id,
      })
      .toPromise();
  }
}
