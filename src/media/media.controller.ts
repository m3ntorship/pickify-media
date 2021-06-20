import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { MediaUploadDTO } from './dto/mediaUpload.dto';
import { MediaService } from './media.service';
// import { resolve } from 'path';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body() mediaUploadDto: MediaUploadDTO,
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
  ) {
    // add file data to db
    await this.mediaService.addFileInDB(file);

    // send ack response
    response.status(201).json({ ack: true });
  }
}
