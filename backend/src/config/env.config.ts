import { IsNumber, IsString, Max, Min, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class EnvConfig {
  @IsNumber()
  @Min(1)
  @Max(65535)
  PORT: number;

  @IsString()
  FRONTEND_URL: string;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  ENVIRONMENT: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validationConfig = plainToClass(EnvConfig, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validationConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    console.log(errors);
    throw new Error(`Env validation failed`);
  }
  return validationConfig;
}
