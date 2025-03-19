import { IPaginationMeta } from 'nestjs-typeorm-paginate';

export class CustomPaginationMeta implements IPaginationMeta {
  public readonly currentPage: number;
  public readonly itemCount: number;

  public readonly currentItemCount: number;
  public readonly itemsPerPage: number;
  public readonly startIndex: number;
  public readonly totalItems: number;
  public readonly pageIndex: number;
  public readonly totalPages: number;

  constructor(meta: IPaginationMeta) {
    this.currentItemCount = meta.itemCount;
    this.itemsPerPage = meta.itemsPerPage;
    this.startIndex = meta.currentPage > 0 ? 1 : 0;
    this.totalItems = meta.totalItems;
    this.pageIndex = meta.currentPage;
    this.totalPages = meta.totalPages;
  }
}
