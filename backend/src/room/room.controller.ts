import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './room.entity';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async createRoom(@Body('name') name: string): Promise<Room> {
    return this.roomService.createRoom(name);
  }

  @Get()
  async getAllRoom(): Promise<Room[]> {
    return this.roomService.findAll();
  }

  @Get(':name')
  async getRoomByName(@Param('name') name: string): Promise<Room | null> {
    return this.roomService.findByName(name);
  }
}
