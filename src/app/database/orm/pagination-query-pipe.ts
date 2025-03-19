import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

export class PaginationQueryPipe implements PipeTransform {
  transform(param: any, metadata: ArgumentMetadata): any {
    const pagination: IPaginationOptions = {
      page: param.pageIndex,
      limit: param.itemsPerPage,
    };
    return pagination;
  }
}
