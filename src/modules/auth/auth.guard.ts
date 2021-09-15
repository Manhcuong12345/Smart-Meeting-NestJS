// import { CanActivate, Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
// import { Observable } from 'rxjs';

// //Cho phep truy cap xac thuc nguoi dung authorization
// @Injectable()
// export class AuthGuard implements CanActivate {
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest();
//     throw new UnauthorizedException();
//   }
// }
