import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerAdapter } from '@/adapters/logger/logger.adapter';
import { Logger } from '@nestjs/common';

const logger = new LoggerAdapter();

export class Entrypoint {
  constructor(readonly documentBuilder: DocumentBuilder) {}

  documentBuilderFactory() {
    return this.documentBuilder
      .setTitle('Portfolio API Swegger')
      .setDescription('Api para consulta das informações do perfil do Linkedin')
      .setVersion('1.0')
      .build();
  }

  async configSwegger(app: any) {
    const config = await this.documentBuilderFactory();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  static async bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    const self = new Entrypoint(new DocumentBuilder());
    self.configSwegger(app);
    app.enableCors();
    const PORT = process.env.PORT || 5000;
    logger.generalInfo(`Running at port: ${PORT}`, 'Bootstrap Logger');
    await app.listen(PORT);
  }
}
