import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import properties from './app.properties';

dotenv.config();

const config = <DataSourceOptions>properties().database;

export default new DataSource(config);
