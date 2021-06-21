import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Readable } from 'node:stream';
import { MediaRepository } from './entities/media.repository';
import { MediaService } from './media.service';

describe('media service', () => {
  let mediaRepo: MediaRepository;
  let mediaService: MediaService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [MediaService, MediaRepository],
    }).compile();

    mediaService = moduleRef.get<MediaService>(MediaService);
    mediaRepo = moduleRef.get<MediaRepository>(MediaRepository);
  });

  it('Should be defined and have the necessary methods', () => {
    // assertions
    expect(mediaService).toBeDefined();
    expect(mediaService).toHaveProperty('addFileInDB');
  });

  describe('addFileInDB method', () => {
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

      // mocks
      mediaRepo.addFile = jest.fn().mockResolvedValueOnce(undefined);

      // actions
      const res = await mediaService.addFileInDB(file);

      // assertions
      expect(res).toBeUndefined();
    });

    it('Should throw error if file not found', () => {
      // mocks
      mediaRepo.addFile = jest.fn().mockResolvedValueOnce(undefined);

      // assertions
      expect(mediaService.addFileInDB).rejects.toThrowError(
        new NotFoundException('File not found'),
      );
    });
  });
});
