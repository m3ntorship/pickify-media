import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PromModule } from '@digikare/nestjs-prom';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import config from './config/database';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../openAPI/media.openAPI.json';
import { MediaModule } from './media/media.module';

const evnVariable = process.env.NODE_ENV || 'development';
@Module({
  imports: [
    ConfigModule.forRoot({
      // load different .env files based on runtime environment variable
      envFilePath: [`.${evnVariable}.env`],
      isGlobal: true,
      load: [configuration],
    }),
    PromModule.forRoot({
      withHttpMiddleware: {
        enable: true,
      },
    }),
    TypeOrmModule.forRoot(config),
    MediaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  // Add swagger middleware to /api endpoint only
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(swaggerUi.serve, swaggerUi.setup(swaggerDocument))
      .exclude('/api/(.[a-z0-9-/]*)')
      .forRoutes('/');
  }
}
