import { Test, TestingModule } from '@nestjs/testing';
import { Readable } from 'stream';
import { MediaRepository } from './entities/media.repository';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

describe('mediaController', () => {
  let mediaController: MediaController;
  let mediaService: MediaService;
  // const mediaService = {
  //   addFileInDB: jest.fn().mockResolvedValueOnce(undefined),
  // };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [MediaService, MediaRepository],
    }).compile();

    mediaController = moduleRef.get<MediaController>(MediaController);
    mediaService = moduleRef.get<MediaService>(MediaService);
  });

  it('should be defined and have the necessary methods', () => {
    // assertions
    expect(mediaController).toBeDefined();
    expect(mediaController).toHaveProperty('uploadFile');
  });

  describe('uploadFile method', () => {
    it('Should call mediaService.addFileInDB with correct arguments', async () => {
      // data
      const mediaDTO = { entity_type: 'post', entity_id: 'test-entity-uuid' };
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
      mediaService.addFileInDB = jest.fn();

      // actions
      await mediaController.uploadFile(mediaDTO, file);

      // assertions
      expect(mediaService.addFileInDB).toHaveBeenCalledWith(file);
    });

    it('Should return the correct response', async () => {
      // data
      const mediaDTO = { entity_type: 'post', entity_id: 'test-entity-uuid' };
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
      const response = { ack: true };

      // mocks
      mediaService.addFileInDB = jest.fn();

      // actions
      const res = await mediaController.uploadFile(mediaDTO, file);

      // assertions
      expect(res).toEqual(response);
    });
  });
});
