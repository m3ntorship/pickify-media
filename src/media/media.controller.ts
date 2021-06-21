import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { MediaUploadDTO } from './dto/mediaUpload.dto';
import type { uploadFIle as IuploadFile } from './interface/uplaodFile.interface';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body() mediaUploadDto: MediaUploadDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IuploadFile> {
    // add file data to db
    await this.mediaService.addFileInDB(file);

    // send ack response
    return { ack: true };
  }
}
