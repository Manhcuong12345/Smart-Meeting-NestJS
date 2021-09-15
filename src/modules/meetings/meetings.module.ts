import { Module,MiddlewareConsumer,NestModule } from '@nestjs/common';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import {RoomsModule} from '../rooms';
import { ResponseModule } from '../response';
import {MeetingsResponse} from './meetings.responsitory'
import { CestronModule } from '../cestron';
import {MeetingTypeModule} from '../meeting-type'
import { AuthMiddleware } from '../auth';
import { NotificationsModule } from '../notifications';

@Module({
  imports:[RoomsModule,ResponseModule,CestronModule,MeetingTypeModule,NotificationsModule],
  controllers: [MeetingsController],
  providers: [MeetingsService,MeetingsResponse],
  exports:[MeetingsService,MeetingsResponse]
})
export class MeetingsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(MeetingsController);
}
}
