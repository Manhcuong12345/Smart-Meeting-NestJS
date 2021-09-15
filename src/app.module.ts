import { Module,MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import {UsersModule} from './modules/users'
import {RegisterModule} from './modules/register'
import {AuthModule} from './modules/auth'
import {RoomsModule} from './modules/rooms'
import {LocationsModule} from './modules/locations'
import {DeviceModule} from './modules/device'
import { MeetingsModule } from './modules/meetings';
import {MeetingTypeModule} from './modules/meeting-type'
import { NotificationsModule } from './modules/notifications';
import {FcmTokenModule} from './modules/fcm-token'
import {LoggerMiddleware} from './local/middleware/logger.middleware'
@Module({
  //su dung module
  imports: [DatabaseModule,UsersModule,RegisterModule,AuthModule,RoomsModule,LocationsModule,DeviceModule,MeetingsModule,MeetingTypeModule,NotificationsModule,FcmTokenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes("*");
  }
}
