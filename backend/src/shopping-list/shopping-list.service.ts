import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ShoppingList } from './shoppintg-list.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomService } from '../room/room.service';

@Injectable()
export class ShoppingListService {
  constructor(
    @InjectRepository(ShoppingList)
    private shoppingListRepository: Repository<ShoppingList>,
    private roomService: RoomService,
  ) {}

  async create(roomName: string): Promise<ShoppingList> {
    await this.roomService.addTool(roomName, 'shopping-list');

    const shoppingList = this.shoppingListRepository.create({
      roomName: roomName,
      items: [],
    });
    return this.shoppingListRepository.save(shoppingList);
  }

  async delete(roomName: string) {
    await this.roomService.deleteTool(roomName, 'shopping-list');
    return this.shoppingListRepository.delete(roomName);
  }

  async getShoppingList(roomName: string): Promise<ShoppingList> {
    const shoppingList = await this.shoppingListRepository.findOne({
      where: { roomName },
    });
    if (!shoppingList) {
      throw new NotFoundException(
        `Il n'y a pas de shoppingList associe a la kolok ${roomName}`,
      );
    }
    return shoppingList;
  }

  async addItem(roomName: string, item: string) {
    const shoppingList = await this.getShoppingList(roomName);

    if (shoppingList.items.includes(item)) {
      throw new ConflictException(`cette article est deja dans la liste`);
    }
    shoppingList.items.push(item);
    return this.shoppingListRepository.save(shoppingList);
  }

  async deleteItem(roomName: string, item: string) {
    const shoppingList = await this.getShoppingList(roomName);
    if (!shoppingList.items.includes(item)) {
      throw new NotFoundException(`cette article n'est pas dans la liste`);
    }
    shoppingList.items = shoppingList.items.filter((i) => i !== item);
    return this.shoppingListRepository.save(shoppingList);
  }

  async getItems(roomName: string) {
    const shoppingList = await this.getShoppingList(roomName);
    return shoppingList.items;
  }
}
