import { SelectQueryBuilder } from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

export class OrderByUtil {
  static prepare<T>(alias: string, sort: T, joinAlias?: string) {
    alias = alias ? alias + '.' : '';
    joinAlias = joinAlias ? joinAlias + '.' : '';

    if (sort) {
      const orderBy = {} as T;
      for (const key of Object.keys(sort)) {
        let newKey = key;
        if (!joinAlias || !key.includes(joinAlias)) {
          newKey = alias + key;
        }
        orderBy[newKey] = sort[key].toUpperCase() == 'DESC' ? 'DESC' : 'ASC';
      }
      return orderBy;
    }
    return undefined;
  }

  static setOrderBy<Entity extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<Entity>,
    sort: { [columnName: string]: 'ASC' | 'DESC' },
    joinAlias?: string,
  ) {
    const alias = queryBuilder.alias;
    queryBuilder.orderBy(this.prepare(alias, sort, joinAlias));
  }
}
