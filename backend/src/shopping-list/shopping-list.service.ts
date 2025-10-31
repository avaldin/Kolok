import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ShoppingList } from './shoppintg-list.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomService } from '../room/room.service';
import { EventsGateway } from '../websocket/websocket.gateway';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ShoppingListService {
  constructor(
    @InjectRepository(ShoppingList)
    private shoppingListRepository: Repository<ShoppingList>,
    private roomService: RoomService,
    private eventsGateway: EventsGateway,
    private notificationService: NotificationsService,
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

  async addItem(userId: string, item: string) {
    const room = await this.roomService.findRoomByUserId(userId);
    const shoppingList = await this.getShoppingList(room.name);

    if (shoppingList.items.includes(item)) {
      throw new ConflictException(`cette article est deja dans la liste`);
    }
    shoppingList.items.push(item);
    await this.shoppingListRepository.save(shoppingList);
    this.eventsGateway.notifyShoppingListUpdate(room.name);
    await this.notificationService.sendRoomNotification({
      roomName: room.name,
      senderId: userId,
      payload: {
        title: `Liste de Course`,
        body: `${item} a ete ajoute a la liste`,
        url: `/tools/shopping-list/`,
      },
    });
  }

  async deleteItem(userId: string, item: string) {
    const room = await this.roomService.findRoomByUserId(userId);
    const shoppingList = await this.getShoppingList(room.name);
    if (!shoppingList.items.includes(item)) {
      throw new NotFoundException(`cette article n'est pas dans la liste`);
    }
    shoppingList.items = shoppingList.items.filter((i) => i !== item);
    await this.shoppingListRepository.save(shoppingList);
    this.eventsGateway.notifyShoppingListUpdate(room.name);
  }

  async getItems(userId: string) {
    const room = await this.roomService.findRoomByUserId(userId);
    const shoppingList = await this.getShoppingList(room.name);
    return shoppingList.items;
  }
}
