import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoomService } from '../room/room.service';

@Injectable()
export class NotificationsService {
  constructor(private roomService: RoomService) {}

  async addUrl(url: string, roomName: string) {
    try {
      await this.roomService.addUrlToRoom(roomName, url);
    } catch (e) {
      if (e instanceof ConflictException) {
        console.log(e.message);
        throw new ConflictException(`vous avez deja active les notifications.`);
      }
      throw new Error(`internal error system`);
    }
  }

  async removeUrl(url: string, roomName: string) {
    try {
      await this.roomService.removeUrlFromRoom(roomName, url);
    } catch (e) {
      if (e instanceof NotFoundException) {
        console.log(e.message);
        throw new NotFoundException(`Les notifications ne sont pas active`);
      }
      throw new Error(`internal error system`);
    }
  }
}
