import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { validateEnv } from './src/config/env.config';

config();

const envConfig = validateEnv(process.env);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envConfig.DB_HOST,
  port: envConfig.DB_PORT,
  username: envConfig.DB_USERNAME,
  password: envConfig.DB_PASSWORD,
  database: envConfig.DB_NAME,

  entities: ['src/**/*.entity.ts'],

  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
