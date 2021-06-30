import { Test, TestingModule } from '@nestjs/testing';
import { Readable } from 'stream';
import { GetMediaDTO } from './dto/getMedia.dto';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

describe('mediaController', () => {
  let mediaController: MediaController;
  const mediaService = {
    uploadService: jest.fn(),
    getMedia: jest.fn(),
    sendFile: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [{ provide: MediaService, useValue: mediaService }],
    }).compile();

    mediaController = moduleRef.get<MediaController>(MediaController);
  });

  it('should be defined and have the necessary methods', () => {
    // assertions
    expect(mediaController).toBeDefined();
    expect(mediaController).toHaveProperty('uploadFile');
    expect(mediaController).toHaveProperty('getMedia');
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

      // actions
      await mediaController.uploadFile(mediaDTO, file);

      // assertions
      expect(mediaService.uploadService).toHaveBeenCalledWith(file, mediaDTO);
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

      // actions
      const res = await mediaController.uploadFile(mediaDTO, file);

      // assertions
      expect(res).toEqual(response);
    });
  });

  describe('getFile method', () => {
    const params: GetMediaDTO = {
      id: '3389e0a0-f543-4423-9c83-39acac2f3381',
    };

    it('Should call mediaService.getMedia with the correct arguments', () => {
      mediaService.getMedia(params.id);
      expect(mediaService.getMedia).toHaveBeenCalledTimes(1);
      expect(mediaService.getMedia).toHaveBeenCalledWith(params.id);
    });

    it('Should return non-empty name of the file with the given id', () => {
      const fileName: string = mediaService.getMedia(params.id);
      expect(fileName).not.toEqual('');
    });
  });
});
