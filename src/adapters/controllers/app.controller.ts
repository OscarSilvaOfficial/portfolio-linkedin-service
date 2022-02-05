import { Controller, Get } from '@nestjs/common';
import { IProfile } from 'src/core/domain/interfaces/profile.interface';
import { LinkedinAdapter } from '../external/likedin.adapter';

@Controller()
export class AppController {
  constructor(readonly linkedinSerive: LinkedinAdapter) {}

  @Get()
  async getLikedinProfile(): Promise<IProfile> {
    const profile = await this.linkedinSerive.getLikedinProfile(false);
    return profile;
  }
}
