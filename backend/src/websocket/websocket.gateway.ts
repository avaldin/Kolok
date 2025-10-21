import { env } from '../main';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: env.FRONTEND_URL, credentials: true },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor() {}

  @SubscribeMessage('JoinShoppingList')
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
