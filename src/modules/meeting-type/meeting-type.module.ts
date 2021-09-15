import { Module,NestModule,MiddlewareConsumer } from '@nestjs/common';
import { MeetingTypeController } from './meeting-type.controller';
import { MeetingTypeService } from './meeting-type.service';
import { ResponseModule } from '../response';
import {MeetingTypeReponsitory} from './meeting-type.reponsitory'
import {AuthMiddleware} from '../auth'


@Module({
  imports:[ResponseModule],
  controllers: [MeetingTypeController],
  providers: [MeetingTypeService,MeetingTypeReponsitory],
  exports:[MeetingTypeService,MeetingTypeReponsitory]
})
export class MeetingTypeModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(MeetingTypeController);
  }
}
