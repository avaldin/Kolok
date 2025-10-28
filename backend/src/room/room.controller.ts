import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { NameValidationPipe } from '../common/pipe/nameValidation.pipe';
import { Room } from './room.entity';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async createRoom(
    @Body('name', NameValidationPipe) name: string,
  ): Promise<Room> {
    return this.roomService.createRoom(name);
  }

  @Get()
  async getAllRoom(): Promise<Room[]> {
    return this.roomService.findAll();
  }

  @Get(':name')
  async getRoomByName(
    @Param('name', NameValidationPipe) name: string,
  ): Promise<Room> {
    return this.roomService.findByName(name);
  }

  @Get('byUserId/:userId')
  async getRoomByUserId(@Param('userId') userId: string): Promise<Room> {
    return this.roomService.findRoomByUserId(userId);
  }

  @Get(':name/tools')
  async getToolsByName(
    @Param('name', NameValidationPipe) name: string,
  ): Promise<string[]> {
    return this.roomService.getTools(name);
  }
}
