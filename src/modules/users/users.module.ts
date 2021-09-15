import { Module,NestModule,MiddlewareConsumer } from '@nestjs/common';
import { UsersService } from './users.service';
import {UsersController} from './users.controller'
import {ResponseModule} from '../response'
import {UserRepository} from './users.repository'
import {AuthMiddleware} from '../auth'

@Module({
  imports: [ResponseModule],
  controllers: [UsersController],
  providers: [UsersService,UserRepository],
  exports: [UsersService,UserRepository]
})
//Ham so sanh middleware dinh tuyen duong di
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(UsersController);
  }
}
