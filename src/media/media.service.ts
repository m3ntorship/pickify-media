import { BadRequestException, Injectable } from '@nestjs/common';
import { MediaRepository } from './entities/media.repository';

@Injectable()
export class MediaService {
  constructor(private mediaRepository: MediaRepository) {}
  async addFileInDB(file: Express.Multer.File): Promise<void> {
    // check file
    if (!file) {
      throw new BadRequestException('File not found');
    }

    // add record for the file in db
    await this.mediaRepository.addFile(file);
  }
}
