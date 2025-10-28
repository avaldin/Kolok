import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { UserService } from '../user/user.service';
import { RoomDto } from './dto/room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    private userService: UserService,
  ) {}

  async createRoom(name: string): Promise<Room> {
    const existingRoom = await this.roomRepository.findOne({ where: { name } });
    if (existingRoom)
      throw new ConflictException(`la room ${name} existe deja`);
    const room = this.roomRepository.create({ name });
    return this.roomRepository.save(room);
  }

  async findByName(name: string): Promise<RoomDto> {
    const roomByName = await this.roomRepository.findOne({
      where: { name },
      relations: ['users'],
    });
    if (!roomByName)
      throw new NotFoundException(`la room ${name} n'existe pas`);
    return roomByName.roomInformation();
  }

  async findRoomByUserId(userId: string): Promise<RoomDto> {
    const roomName = await this.userService.getRoom(userId);
    if (!roomName)
      throw new NotFoundException(`cet user n'est dans aucune room`);
    const room = await this.roomRepository.findOne({
      where: { name: roomName },
      relations: ['users'],
    });

    if (!room)
      throw new Error(`internal system error: RoomDb and UserDb dismatch`);
    return room.roomInformation();
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
}
