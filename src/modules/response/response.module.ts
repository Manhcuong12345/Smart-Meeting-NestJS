import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import {ResponseRepository} from './response.repository'

@Module({
  imports: [],
  providers: [ResponseService,ResponseRepository],
  exports: [ResponseService,ResponseRepository]
})
export class ResponseModule {}
