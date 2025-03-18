import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Createpayment1710428197024 implements MigrationInterface {
  private TABLE_NAME = 'payments';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.TABLE_NAME,
        columns: [
          {
            name: 'id',
            type: 'UUID',
            isPrimary: true,
            default: 'gen_random_uuid()',
            primaryKeyConstraintName: `pk_${this.TABLE_NAME}_id`,
          },
          {
            name: 'amount',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'VARCHAR(3)',
            isNullable: false,
            default: "'BRL'",
          },
          {
            name: 'method',
            type: 'VARCHAR(20)',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'VARCHAR(20)',
            isNullable: false,
            default: "'PENDING'",
          },
          {
            name: 'product_id',
            type: 'VARCHAR(50)',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'TIMESTAMP WITH TIME ZONE',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'TIMESTAMP WITH TIME ZONE',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.TABLE_NAME);
  }
}
