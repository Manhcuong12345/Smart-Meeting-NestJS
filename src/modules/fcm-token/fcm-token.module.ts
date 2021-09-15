import { Module,NestModule,MiddlewareConsumer } from '@nestjs/common';
import { FcmTokenController } from './fcm-token.controller';
import { FcmTokenService } from './fcm-token.service';
import {AuthMiddleware} from '../auth'
import { UsersModule } from '../users'; 


@Module({
  imports: [UsersModule],
  controllers: [FcmTokenController],
  providers: [FcmTokenService],
  exports:[FcmTokenService]
})
export class FcmTokenModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(FcmTokenController);
}
}
