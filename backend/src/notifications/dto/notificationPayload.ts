import { IsNotEmpty, IsString } from 'class-validator';

export class NotificationPayload {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}
