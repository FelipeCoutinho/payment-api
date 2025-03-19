import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Payment } from '../../app/payment/entities/payment.entity';
import { DataSource } from 'typeorm';

export class TestDatabase {
  private static instance: TestDatabase;
  private container: StartedPostgreSqlContainer;
  public dataSource: DataSource;

  private constructor() { }

  public static async getInstance(): Promise<TestDatabase> {
    if (!TestDatabase.instance) {
      TestDatabase.instance = new TestDatabase();
      await TestDatabase.instance.init();
    }
    return TestDatabase.instance;
  }

  private async init() {
    this.container = await new PostgreSqlContainer()
      .withDatabase('testdb')
      .withUsername('testuser')
      .withPassword('testpass')
      .start();

    this.dataSource = new DataSource({
      type: 'postgres',
      host: this.container.getHost(),
      port: this.container.getPort(),
      username: 'testuser',
      password: 'testpass',
      database: 'testdb',
      entities: [Payment],
      synchronize: true,
      logging: true,
    });

    await this.dataSource.initialize();
  }

  public async stop() {
    await this.dataSource.destroy();
    await this.container.stop();
  }
}
