import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';


//pipes là một hàm được gọi trước khi tới handler route và được sử dụng để chuyển đổi dữ liệu đầu vào
// Nhiệm vụ
// Pipes có hai trường hợp sử dụng điển hình:
// transformation: chuyển đổi dữ liệu đầu vào sang dạng mong muốn (ví dụ: từ chuỗi thành số nguyên)
// validation: đánh giá dữ liệu đầu vào và nếu hợp lệ, chỉ cần chuyển nó qua không thay đổi; nếu không, hãy ném một exception khi dữ liệu không chính xác
@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}
