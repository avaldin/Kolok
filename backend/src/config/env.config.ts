import { IsNumber, IsString, Max, Min, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class EnvConfig {
  @IsNumber()
  @Min(1)
  @Max(65535)
  PORT: number;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validationConfig = plainToClass(EnvConfig, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validationConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      `Env validation failed\n\n .env have to be formated as :\n\n${JSON.stringify(EnvConfig.prototype, null, 2)}`,
    );
  }
  return validationConfig;
}
