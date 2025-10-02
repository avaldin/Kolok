import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async createRoom(name: string): Promise<Room> {
    const existingRoom = await this.roomRepository.findOne({ where: { name } });
    if (existingRoom) throw new ConflictException(`la room${name} existe deja`);
    const room = this.roomRepository.create({ name });
    return this.roomRepository.save(room);
  }

  async findAll(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  async findByName(name: string): Promise<Room> {
    const roomByName = await this.roomRepository.findOne({ where: { name } });
    if (!roomByName)
      throw new NotFoundException(`la room ${name} n'existe pas`);
    return roomByName;
  }

  async addParticipant(roomName: string, participantName: string) {
    const room = await this.findByName(roomName);
    if (room.participants.includes(participantName))
      throw new ConflictException(
        `${participantName} est deja dans cette room`,
      );
    room.participants.push(participantName);
    await this.roomRepository.save(room);
  }

  async removeParticipant(
    roomName: string,
    participantName: string,
  ): Promise<void> {
    const room = await this.findByName(roomName);
    if (!room.participants.includes(participantName))
      throw new NotFoundException(
        `${participantName} n'est pas dans cette room`,
      );
    room.participants.splice(room.participants.indexOf(participantName), 1);
    await this.roomRepository.save(room);
  }

  async getTools(name: string): Promise<string[]> {
    const room = await this.findByName(name);
    return room.tool;
  }

  async deleteTool(name: string, toolName: string): Promise<Room> {
    const room = await this.findByName(name);
    if (!room.tool.includes(toolName))
      throw new NotFoundException(
        `l'outil ${toolName} n'existe pas dans cette kolok`,
      );
    room.tool = room.tool.filter((tool) => tool !== toolName);
    return this.roomRepository.save(room);
  }

  async addTool(name: string, toolName: string): Promise<Room> {
    const room = await this.findByName(name);
    if (room.tool.includes(toolName))
      throw new NotFoundException(
        `l'outil ${toolName} existe deja dans cette kolok`,
      );
    room.tool.push(toolName);
    return this.roomRepository.save(room);
  }
}
