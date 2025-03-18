import { NotFoundException } from '@nestjs/common';
import { FindManyOptions, FindOptionsRelations, Repository, SelectQueryBuilder } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { AbstractEntity } from './abstract-entity';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { CustomPaginationMeta } from './custom-pagination-meta';

export abstract class AbstractRepository<T extends AbstractEntity> extends Repository<T> {
  protected constructor(protected readonly repository: Repository<T>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  public async findAll(pagination?: IPaginationOptions, options?: FindManyOptions<T>) {
    if (!pagination || JSON.stringify(pagination) === '{}') {
      pagination = {} as IPaginationOptions;
    }
    pagination.page = pagination?.page || 1;
    pagination.limit = pagination?.limit || 10;

    options = {
      ...{ order: { createdAt: 'ASC' } },
      ...options,
    } as FindManyOptions<T>;

    pagination.metaTransformer = (meta) => new CustomPaginationMeta(meta);

    return paginate<T>(this, pagination, options);
  }

  async findAllWithQueryBuilder(queryBuilder: SelectQueryBuilder<T>, pagination?: IPaginationOptions) {
    if (!pagination || JSON.stringify(pagination) === '{}') {
      pagination = {} as IPaginationOptions;
    }
    pagination.page = pagination?.page || 1;
    pagination.limit = pagination?.limit || 10;

    pagination.metaTransformer = (meta) => new CustomPaginationMeta(meta);

    return paginate<T>(queryBuilder, pagination);
  }

  public async findById(id: string, relations?: FindOptionsRelations<T>) {
    const obj = await this.findOne({
      where: {
        id: id,
      } as FindOptionsWhere<T>,
      relations: relations,
    });
    if (!obj) {
      throw new NotFoundException(`Not found with id (${id})`);
    }
    return obj;
  }

  public async updateById(id: string, obj: any) {
    await this.update(id, obj);
    return await this.findById(id);
  }

  public async removeById(id: string) {
    const obj = await this.findById(id);
    await this.remove(obj);
  }
}
