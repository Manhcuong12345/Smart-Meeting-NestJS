import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
//Middleware là một hàm được gọi trước khi tới handler route.Bạn có quyền truy cập vào các object 
//request và response cũng như hàm middleware next() trong chu trình 
//request-response của ứng dụng, nhưng bạn không có kết quả của trình handler route. 
//Về cơ bản chúng là các chức năng Middleware thể hiện.

/** Cac nhiem vu
Thực thi bất kỳ đoạn code nào.
Thực hiện các thay đổi đối với request và response object.
Kết thúc chu kỳ request-response.
Gọi hàm middleware tiếp theo trong ngăn xếp.
Nếu hàm middleware hiện tại không kết thúc chu kỳ request-response, 
nó phải gọi next() để chuyển quyền điều khiển 
cho hàm middleware tiếp theo. Nếu không, request sẽ bị treo.
 */
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request... ${req.method}: ${req.originalUrl}`);
    next();
  }
}
