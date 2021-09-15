import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { ResponseModule } from '../response';
import { DeviceRepository } from './device.reponsitory'
import { AuthMiddleware } from '../auth';
//su dung RoomModule module vao de dung
import {CestronModule} from '../cestron'
import { RoomsModule } from '../rooms'

@Module({
  imports: [ResponseModule,RoomsModule,CestronModule],
  controllers: [DeviceController],
  providers: [DeviceService, DeviceRepository],
  exports: [DeviceService,DeviceRepository]
})
export class DeviceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(DeviceController);
  }
}
