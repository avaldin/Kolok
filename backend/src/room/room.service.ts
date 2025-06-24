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
      throw new ConflictException(`room with name ${name} already exists`);
    const room = this.roomRepository.create({ name });
    return this.roomRepository.save(room);
  }

  async findAll(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  async findByName(name: string): Promise<Room> {
    const roomByName = await this.roomRepository.findOne({ where: { name } });
    if (!roomByName)
      throw new NotFoundException(`room with name ${name} doesn't exist`);
    return roomByName;
  }

  async addParticipant(roomName: string, participantName: string) {
    const room = await this.findByName(roomName);
    if (room.participants.includes(participantName))
      throw new ConflictException(
        `${participantName} est deja dans cette room`,
      );
    room.participants.push(participantName);
  }

  async removeParticipant(
    roomName: string,
    participantName: string,
  ): Promise<void> {
    const room = await this.findByName(roomName);
    if (!room.participants.includes(roomName))
      throw new NotFoundException(
        `${participantName} n'est pas dans cette room`,
      );
  }

  async participantsByRoom(roomName: string): Promise<string[]> {
    const room = await this.findByName(roomName);
    return room.participants;
  }
}
