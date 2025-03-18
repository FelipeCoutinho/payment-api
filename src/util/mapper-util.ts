import { ClassConstructor, instanceToPlain, plainToInstance } from 'class-transformer';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';

export class MapperUtil {
  static castObj<T>(source: any, target: ClassConstructor<T>): T {
    const data = instanceToPlain(source);
    return plainToInstance<T, Record<string, any>>(target, data, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
      enableImplicitConversion: true,
    });
  }
}

export class PaginationMapperUtil {
  static cast<U, T>(source: Pagination<U>, target: ClassConstructor<T>) {
    return new Pagination<T, IPaginationMeta>(
      source.items.map((obj) => MapperUtil.castObj(obj, target)),
      source.meta,
      source.links,
    );
  }
}
