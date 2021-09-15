import { Module,MiddlewareConsumer } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ResponseModule } from '../response';
import {UsersModule } from '../users';
import { RoomsModule } from '../rooms';
import {NotificationsRepository} from './notifications.repository'
import { FirebaseModule } from '../firebase';
import { AuthMiddleware } from '../auth';

@Module({
  imports: [RoomsModule,UsersModule,ResponseModule,FirebaseModule],
  controllers: [NotificationsController],
  providers: [NotificationsService,NotificationsRepository],
  exports:[NotificationsRepository,NotificationsService]
})
export class NotificationsModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(NotificationsController);
  }
}
