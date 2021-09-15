import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class PagingPipe implements PipeTransform<any, any> {
    transform(value: any, metadata: ArgumentMetadata): any {
      if((value.page && isNaN(value.page)) || (value.limit && isNaN(value.limit)))
      throw new BadRequestException("Page and limit should be a numberic");

      value.page = (value.page) ? parseInt(value.page, 10) :value.page
      value.limit = (value.limit) ? parseInt(value.limit, 10) :value.limit

      return value
    }
}