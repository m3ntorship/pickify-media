import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaService {
  addFileInDB(file: Express.Multer.File) {
    return {};
  }
}
