import { Module } from '@nestjs/common';
import { EventsGateway } from './websocket.gateway';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [RoomModule],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class WebSocketModule {}
