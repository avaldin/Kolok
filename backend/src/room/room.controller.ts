import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { NameValidationPipe } from './pipe/nameValidation.pipe';
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

  @Post(`room/:name/participants`)
  async addParticipant(
    @Param('roomName', NameValidationPipe) roomName: string,
    @Body('participantName', NameValidationPipe) participantName: string,
  ) {
    await this.roomService.addParticipant(roomName, participantName);
  }

  @Delete(':name/participants/:participantName')
  async removeParticipant(
    @Param('participantName', NameValidationPipe) participantName: string,
    @Param('roomName', NameValidationPipe) roomName: string,
  ) {
    await this.roomService.removeParticipant(roomName, participantName);
  }

  @Get(':name/participants')
  async getParticipants(@Param('name', NameValidationPipe) name: string) {
    return this.roomService.findAll();
  }
}
