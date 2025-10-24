import { RoomModule } from '../room/room.module';
import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [RoomModule],
  providers: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
