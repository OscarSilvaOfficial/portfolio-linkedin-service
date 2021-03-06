import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { IProfile } from '@/core/domain/interfaces/profile.interface';
import { LinkedinPort } from '@/ports/linkedin.port';
import { NoSQLPort } from '@/ports/nosql.port';
import { ApiTags } from '@nestjs/swagger';
import { linkedinProfileService } from '@/core/useCases/linkedinProfile.service';
import { LinkedinRepositoryPort } from '@/ports/linkedin.repository.port';
import { LinkedinRepository } from '../repository/linkedin.repository';
import { MongoAdapter } from '@/infra/database/mongo.adapter';
import { LoggerAdapter } from '@/adapters/logger/logger.adapter';
import { AxiosAdapter } from '@/adapters/external/axios.adapter';
import { LinkedinAdapter } from '@/adapters/external/likedin.adapter';

@ApiTags('Likedin Profile API')
@Controller()
export class AppController {
  db: NoSQLPort;
  linkedinAdapter: LinkedinPort;
  repository: LinkedinRepositoryPort;
  useCase: linkedinProfileService;

  constructor(
    readonly requestAdapter: AxiosAdapter,
    readonly logger: LoggerAdapter,
  ) {
    this.db = MongoAdapter.factory(logger);
    this.linkedinAdapter = new LinkedinAdapter(this.requestAdapter);
    this.repository = new LinkedinRepository(this.db);
    this.useCase = new linkedinProfileService(
      this.repository,
      this.linkedinAdapter,
      logger,
    );
  }

  @Get()
  async getLikedinProfile(@Req() request: Request): Promise<IProfile> {
    this.logger.debug(request, 'getLikedinProfile');
    return await this.useCase.getLikedinProfile();
  }
}
