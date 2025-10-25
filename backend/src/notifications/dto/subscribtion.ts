import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SubscriptionKeys {
  @IsString()
  @IsNotEmpty()
  p256dh: string;

  @IsString()
  @IsNotEmpty()
  auth: string;
}

export class SubscriptionDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @ValidateNested()
  @Type(() => SubscriptionKeys)
  keys: SubscriptionKeys;
}
