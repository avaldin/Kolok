import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { validateEnv } from './src/config/env.config';

config();

const envConfig = validateEnv(process.env);

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: envConfig.DATABASE_URL,

  entities: ['src/**/*.entity.ts'],

  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
