import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class DynamicSortPipe implements PipeTransform {
  transform(param: any, metadata: ArgumentMetadata) {
    let sorts: string[] = [];
    if (param.sort) {
      sorts = typeof param.sort === 'string' ? [param.sort] : param.sort;
    }

    if (sorts?.length > 0) {
      const orderBy: object = {};
      for (const sort of sorts) {
        const lastIndex = sort.lastIndexOf('.');
        const field = sort.substring(0, lastIndex);
        const order = sort.substring(lastIndex + 1);

        orderBy[field] = order?.toUpperCase() == 'DESC' ? 'DESC' : 'ASC';
      }
      return orderBy;
    }

    return undefined;
  }
}
