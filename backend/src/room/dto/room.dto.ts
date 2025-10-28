import { IsArray, IsString } from 'class-validator';

export class RoomDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  participants: string[];

  @IsArray()
  @IsString({ each: true })
  tools: string[];
}
