import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  getMedia(id: string): string {
    // Check if file present in the default directory that stores media and files which is : /media, if so return its name + extension
    const fileName: string = this.mediaRepository.getFullFileName(id);

    if (!fileName) {
      throw new NotFoundException('ERROR! File not found!');
    }

    return fileName;
  }
}
