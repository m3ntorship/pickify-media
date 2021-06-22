import { BadRequestException, Injectable } from '@nestjs/common';
import { MediaUploadDTO } from './dto/mediaUpload.dto';
import { MediaRepository } from './entities/media.repository';

@Injectable()
export class MediaService {
  constructor(private mediaRepository: MediaRepository) {}
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
  }
}
