import { Module, NestModule,MiddlewareConsumer } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import {AuthMiddleware} from '../auth'
// import {LocationsRepository} from './locations.repository'

@Module({
  // imports: [ResponseModule],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService]
})
export class LocationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(LocationsController);
  }
}
