import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    BadGatewayException,
    CallHandler,
    HttpException,
    BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        return next
            .handle()
            .pipe(
                catchError(err => {
                    let { response } = err;

                    if(!response.error_code){
                        response = { error_code: response.statusCode, error_message: response.message};
                    }
                    if(Array.isArray(response.error_message)) response.error_message = response.error_message[0];

                    console.log(`status: ${response.error_code.toString()} ${Date.now() - now}ms`);
                    return throwError(new HttpException(response, response.error_code));
                }),
            );
    }
}
  