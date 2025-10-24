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
    if (existingRoom)
      throw new ConflictException(`la room ${name} existe deja`);
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
    return room.tools;
  }

  async deleteTool(name: string, toolsName: string): Promise<Room> {
    const room = await this.findByName(name);
    if (!room.tools.includes(toolsName))
      throw new NotFoundException(
        `l'outil ${toolsName} n'existe pas dans cette kolok`,
      );
    room.tools = room.tools.filter((tools) => tools !== toolsName);
    return this.roomRepository.save(room);
  }

  async addTool(name: string, toolsName: string): Promise<Room> {
    const room = await this.findByName(name);
    if (room.tools.includes(toolsName))
      throw new NotFoundException(
        `l'outil ${toolsName} existe deja dans cette kolok`,
      );
    room.tools.push(toolsName);
    return this.roomRepository.save(room);
  }

  async addUrlToRoom(roomName: string, url: string) {
    const room = await this.findByName(roomName);
    if (room.notifictionsURL.includes(url))
      throw new ConflictException(`this URL is already in this room`);
    room.notifictionsURL.push(url);
    await this.roomRepository.save(room);
  }

  async removeUrlFromRoom(roomName: string, url: string): Promise<void> {
    const room = await this.findByName(roomName);
    if (!room.notifictionsURL.includes(url))
      throw new NotFoundException(`this URL isn't in this room`);
    room.notifictionsURL.filter((u) => u !== url);
    await this.roomRepository.save(room);
  }

  async getUrlFromRoom(roomName: string): Promise<string[]> {
    const room = await this.findByName(roomName);
    return room.notifictionsURL;
  }
}
