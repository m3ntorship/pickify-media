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
import * as fs from 'fs';
import * as path from 'path';

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

  getFullFileName(id: string): string {
    // get absolute path to the /media directory that contains the files that has been stored locally on the system
    const directoryPath: string = path.resolve('media');
    let fileFullName = '';
    // we need to get the whole files' names stored since we don't know the extension of the given file_id (if present)
    // so we must compare the id with the whole files' names stored and then get the extension of that file
    const filenames: Array<string> = fs.readdirSync(directoryPath);

    filenames.forEach((file) => {
      const currentFileName = file.split('.');
      if (currentFileName[0] === id) {
        fileFullName = file;
      }
    });

    return fileFullName;
  }

  getMedia(id: string): string {
    // Check if file present in the default directory that stores media and files which is : /media, if so return its name + extension
    const fileName: string = this.getFullFileName(id);

    if (!fileName) {
      throw new NotFoundException('ERROR! File not found!');
    }

    return fileName;
  }
}
