import { EntityRepository, Repository } from 'typeorm';
import { Media } from './media.entity';
import * as fs from 'fs';
import * as path from 'path';

@EntityRepository(Media)
export class MediaRepository extends Repository<Media> {
  async addFile(file: Express.Multer.File): Promise<Media> {
    const newFile = this.create();
    newFile.uploaded = false;
    newFile.uuid = file.filename.split('.')[0];
    newFile.name = file.originalname;
    return await this.save(newFile);
  }

  getFullFileName(id: string): string {
    const directoryPath: string = path.resolve('media');
    let fileFullName = '';

    const filenames: Array<string> = fs.readdirSync(directoryPath);
    filenames.forEach((file) => {
      const currentFileName = file.split('.');
      if (currentFileName[0] === id) {
        fileFullName = file;
      }
    });

    return fileFullName;
  }
}
