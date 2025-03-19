import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { DataSource } from 'typeorm';
import { Payment } from '../entities/payment.entity';

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
    // Criando um container PostgreSQL para testes
    this.container = await new PostgreSqlContainer()
      .withDatabase('testdb')
      .withUsername('testuser')
      .withPassword('testpass')
      .start();

    // Criando conexão com TypeORM
    this.dataSource = new DataSource({
      type: 'postgres',
      host: this.container.getHost(),
      port: this.container.getPort(),
      username: 'testuser',
      password: 'testpass',
      database: 'testdb',
      entities: [Payment],
      synchronize: true, // Para recriar as tabelas automaticamente nos testes
    });

    await this.dataSource.initialize();
  }

  public async stop() {
    await this.dataSource.destroy();
    await this.container.stop();
  }
}
