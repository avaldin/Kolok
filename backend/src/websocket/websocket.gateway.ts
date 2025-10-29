import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { validateEnv } from '../config/env.config';
import { config } from 'dotenv';
import { RoomService } from '../room/room.service';

config();

const env = validateEnv(process.env);

@WebSocketGateway({
  cors: { origin: env.FRONTEND_URL, credentials: true },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;
  constructor(private roomService: RoomService) {}

  @SubscribeMessage('joinShoppingList')
  async handleJoin(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const room = await this.roomService.findRoomByUserId(userId);
    await client.join(`shopping-list:${room.name}`);
  }

  notifyShoppingListUpdate(roomName: string) {
    this.server.to(`shopping-list:${roomName}`).emit(`listUpdated`);
  }
}
