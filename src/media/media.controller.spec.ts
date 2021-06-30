import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import * as path from 'path';
import { Readable } from 'stream';
import { GetMediaDTO } from './dto/getMedia.dto';
import { MediaRepository } from './entities/media.repository';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

describe('mediaController', () => {
  let mediaController: MediaController;
  let mediaService: MediaService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'RABBITMQ_BROKER',
            transport: Transport.RMQ,
            options: {
              urls: ['amqp://localhost:5672'],
              queue: 'cats_queue',
              queueOptions: {
                durable: false,
              },
            },
          },
        ]),
      ],
      controllers: [MediaController],
      providers: [MediaService, ConfigService, MediaRepository],
    }).compile();

    mediaController = moduleRef.get<MediaController>(MediaController);
    mediaService = moduleRef.get<MediaService>(MediaService);
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

      // mocks
      mediaService.uploadService = jest.fn();

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

      // mocks
      mediaService.uploadService = jest.fn();

      // actions
      const res = await mediaController.uploadFile(mediaDTO, file);

      // assertions
      expect(res).toEqual(response);
    });
  });

  describe('getMedia method', () => {
    it('Should call mediaService.getMedia with the correct arguments', () => {
      //data
      const params: GetMediaDTO = {
        id: '3389e0a0-f543-4423-9c83-39acac2f3381',
      };

      // mocks
      const res = {
        sendFile: jest.fn(),
      };
      mediaService.getMedia = jest.fn().mockReturnValue('path-to');

      // actions
      mediaController.getMedia(params, res);

      //assertions
      expect(mediaService.getMedia).toHaveBeenCalledWith(params.id);
    });

    it('Should call res.sendFile with the correct parameters', () => {
      //data
      const params: GetMediaDTO = {
        id: '3389e0a0-f543-4423-9c83-39acac2f3381',
      };
      const fileName = 'fileName';
      const fileAbsolutePath: string = path.resolve('media', fileName);

      // mocks
      const res = {
        sendFile: jest.fn(),
      };
      mediaService.getMedia = jest.fn().mockReturnValue(fileName);

      //actions
      mediaController.getMedia(params, res);

      //assertions
      expect(res.sendFile).toHaveBeenCalledWith(fileAbsolutePath);
    });

    it('Should return undefined', () => {
      //data
      const params: GetMediaDTO = {
        id: '3389e0a0-f543-4423-9c83-39acac2f3381',
      };

      // mocks
      const res = {
        sendFile: jest.fn(),
      };
      mediaService.getMedia = jest.fn().mockReturnValue('value');

      //actions
      const x = mediaController.getMedia(params, res);

      // assertions
      expect(x).toBeUndefined();
    });
  });
});
