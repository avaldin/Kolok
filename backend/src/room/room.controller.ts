import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { NameValidationPipe } from '../common/pipe/nameValidation.pipe';
import { Room } from './room.entity';
import { RoomDto } from './dto/room.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async createRoom(
    @Body('name', NameValidationPipe) name: string,
  ): Promise<Room> {
    return this.roomService.createRoom(name);
  }

  @Get(':name')
  async getRoomByName(
    @Param('name', NameValidationPipe) name: string,
  ): Promise<RoomDto> {
    return this.roomService.getRoomDto(name);
  }

  @Get('byUserId/:userId')
  async getRoomByUserId(@Param('userId') userId: string): Promise<RoomDto> {
    return this.roomService.findRoomByUserId(userId);
  }

  @Get(':name/tools')
  async getToolsByName(
    @Param('name', NameValidationPipe) name: string,
  ): Promise<string[]> {
    return this.roomService.getTools(name);
  }

  @Post('join-room')
  async joinRoom(@Body('id') id: string, @Body('roomName') roomName: string) {
    await this.roomService.joinRoom(roomName, id);
  }

  @Delete('leave-room')
  async leaveRoom(@Body('id') id: string) {
    await this.roomService.quitRoom(id);
  }
}
