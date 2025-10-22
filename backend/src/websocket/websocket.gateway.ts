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

config();

const env = validateEnv(process.env);

@WebSocketGateway({
  cors: { origin: env.FRONTEND_URL, credentials: true },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor() {}

  @SubscribeMessage('joinShoppingList')
  async handleJoin(
    @MessageBody() roomName: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(`shopping-list:${roomName}`);
  }

  notifyShoppingListUpdate(roomName: string) {
    this.server.to(`shopping-list:${roomName}`).emit(`listUpdated`);
  }
}
