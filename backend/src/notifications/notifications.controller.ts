import { Body, Controller, Delete, Post } from '@nestjs/common';
import { NameValidationPipe } from '../common/pipe/nameValidation.pipe';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async subscribe(
    @Body('roomName', NameValidationPipe) roomName: string,
    @Body(`URL`) Url: string,
  ) {
    await this.notificationsService.addUrl(Url, roomName);
  }

  @Delete()
  async unSubscribe(
    @Body('roomName', NameValidationPipe) roomName: string,
    @Body(`URL`) Url: string,
  ) {
    await this.notificationsService.removeUrl(Url, roomName);
  }
}
