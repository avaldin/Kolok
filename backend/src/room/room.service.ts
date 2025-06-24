import { Injectable } from '@nestjs/common';
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
    const room = this.roomRepository.create({ name });
    return this.roomRepository.save(room);
  }

  async findAll(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  async findByName(name: string): Promise<Room | null> {
    return this.roomRepository.findOne({ where: { name } });
  }
}
