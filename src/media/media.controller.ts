import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Response,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetMediaDTO } from './dto/getMedia.dto';
import * as path from 'path';
import { ValidationExceptionFilter } from '../shared/exception-filters/validation-exception.filter';
import { MediaUploadDTO } from './dto/mediaUpload.dto';
import type { uploadFIle as IuploadFile } from './interface/uplaodFile.interface';
import { MediaService } from './media.service';
import * as winston from 'winston';
import { winstonLoggerOptions } from '../logging/winston.options';
@Controller('media')
@UseFilters(
  new ValidationExceptionFilter(winston.createLogger(winstonLoggerOptions)),
)
export class MediaController {
  constructor(private mediaService: MediaService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body() mediaUploadDto: MediaUploadDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IuploadFile> {
    // add file data to db and send message once it is done
    await this.mediaService.uploadService(file, mediaUploadDto);

    // send ack response
    return { ack: true };
  }

  @Get('/:id')
  getMedia(@Param() params: GetMediaDTO, @Response() res) {
    // get the needed file full name with its extension
    const fileName = this.mediaService.getMedia(params.id);

    // send file as a response
    res.sendFile(path.resolve('media', fileName));
  }
}
