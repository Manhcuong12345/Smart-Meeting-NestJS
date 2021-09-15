import { Module,NestModule,MiddlewareConsumer,forwardRef } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import {RoomsRepository} from './rooms.repository'
import {ResponseModule} from '../response'
import { AuthMiddleware } from '../auth';
import {CestronModule} from '../cestron'


@Module({
  imports: [ResponseModule,forwardRef(()=>CestronModule)],
  controllers: [RoomsController],
  providers: [RoomsService,RoomsRepository],
  exports:[RoomsService,RoomsRepository]
})
export class RoomsModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(RoomsController);
  }
}
