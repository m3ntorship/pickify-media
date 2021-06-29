import { BadRequestException, Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { diskStorage, DiskStorageOptions, FileFilterCallback } from 'multer';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      // store the file in the disk at ./media with naem `${uuid().filetype}`
      storage: diskStorage(<DiskStorageOptions>{
        destination: function (req, file, cb) {
          cb(null, './media');
        },
        filename: function (req, file, cb) {
          const fileName = `${uuid()}.${file.mimetype.split('/')[1]}`;
          cb(null, fileName);
        },
      }),
      // Max file size 10 MB
      limits: { fileSize: 10000000 },
      // reject any files that are not png | jpeg | jpg
      fileFilter: (req, file, cb: FileFilterCallback) => {
        if (
          file.mimetype === 'image/png' ||
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/jpg'
        ) {
          cb(null, true);
        } else {
          cb(new BadRequestException('supported images are png, jpeg or jpg'));
        }
      },
    };
  }
}
