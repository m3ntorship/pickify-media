import { EntityRepository, Repository } from 'typeorm';
import { Media } from './media.entity';

@EntityRepository(Media)
export class MediaRepository extends Repository<Media> {
  async addFile(file: Express.Multer.File): Promise<Media> {
    const newFile = this.create();
    newFile.uploaded = false;
    newFile.uuid = file.filename.split('.')[0];
    newFile.name = file.originalname;
    return await this.save(newFile);
  }
}
