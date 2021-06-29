import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Readable } from 'node:stream';
import { MediaUploadDTO } from './dto/mediaUpload.dto';
import { MediaRepository } from './entities/media.repository';
import { MediaService } from './media.service';
import * as fs from 'fs';
import * as path from 'path';

describe('media service', () => {
  let mediaRepo: MediaRepository;
  let mediaService: MediaService;
  const clientProxy = {
    emit: jest.fn().mockImplementation(() => ({
      toPromise: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        MediaService,
        MediaRepository,
        { provide: 'RABBITMQ_BROKER', useValue: clientProxy },
      ],
    }).compile();

    mediaService = moduleRef.get<MediaService>(MediaService);
    mediaRepo = moduleRef.get<MediaRepository>(MediaRepository);
  });

  it('Should be defined and have the necessary methods', () => {
    // assertions
    expect(mediaService).toBeDefined();
    expect(mediaService).toHaveProperty('uploadService');
    expect(mediaService).toHaveProperty('getMedia');
  });

  describe('uploadService method', () => {
    it('Should return undefined', async () => {
      // data
      const file = {
        buffer: {} as Buffer,
        destination: '',
        fieldname: '',
        filename: '',
        mimetype: '',
        originalname: '',
        path: '',
        size: 10,
        stream: {} as Readable,
        encoding: '',
      };
      const createdFileInDB = {
        uuid: 'test-uuid-of-file-after-it-is-added-in-DB',
      };

      const uploadData: MediaUploadDTO = {
        entity_id: 'entity-test-id',
        entity_type: 'option',
      };

      // mocks
      mediaRepo.addFile = jest.fn().mockResolvedValueOnce(createdFileInDB);

      // actions
      const res = await mediaService.uploadService(file, uploadData);

      // assertions
      expect(res).toBeUndefined();
    });

    it('Should call rabbitMQClient with necessary values to emit the message', async () => {
      // data
      const file = {
        buffer: {} as Buffer,
        destination: '',
        fieldname: '',
        filename: '',
        mimetype: '',
        originalname: '',
        path: '',
        size: 10,
        stream: {} as Readable,
        encoding: '',
      };
      const createdFileInDB = {
        uuid: 'test-uuid-of-file-after-it-is-added-in-DB',
      };

      const uploadData: MediaUploadDTO = {
        entity_id: 'entity-test-id',
        entity_type: 'option',
      };

      // mocks
      mediaRepo.addFile = jest.fn().mockResolvedValueOnce(createdFileInDB);

      // actions
      await mediaService.uploadService(file, uploadData);

      // assertions
      expect(clientProxy.emit).toHaveBeenCalledWith('added_media_data', {
        file_id: createdFileInDB.uuid,
        entity_type: uploadData.entity_type,
        entity_id: uploadData.entity_id,
      });
    });

    it('Should throw error if file not found', () => {
      // mocks
      mediaRepo.addFile = jest.fn().mockResolvedValueOnce(undefined);

      // assertions
      expect(mediaService.uploadService).rejects.toThrowError(
        new NotFoundException('File not found'),
      );
    });
  });

  describe('getMedia method', () => {
    let id = 'f1';
    it('Should call getFullFileName once and with correct arguments', () => {
      mediaRepo.getFullFileName = jest.fn().mockReturnValueOnce(id);
      mediaRepo.getFullFileName(id);

      expect(mediaRepo.getFullFileName).toHaveBeenCalledTimes(1);
      expect(mediaRepo.getFullFileName).toHaveBeenCalledWith(id);
    });

    it('Should return file name', () => {
      mediaRepo.getFullFileName = jest.fn().mockReturnValueOnce(id);
      const fileName = mediaRepo.getFullFileName(id);

      expect(fileName).toEqual(id);
    });

    it('Should throw error if the given id is not present', () => {
      mediaRepo.getFullFileName = jest.fn().mockReturnValueOnce('');
      id = 'fileNotPresent';
      const fileName = mediaRepo.getFullFileName('');

      expect(fileName).toEqual('');
      expect(mediaService.getMedia).toThrowError();
    });
  });
});
