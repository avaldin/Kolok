import { Body, Controller, Delete, Post } from '@nestjs/common';
import { NameValidationPipe } from '../common/pipe/nameValidation.pipe';
import { NotificationsService } from './notifications.service';
import { SubscriptionDto } from './dto/subscribtion';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async subscribe(
    @Body('userId', NameValidationPipe) userId: string,
    @Body() subscribtionDto: SubscriptionDto,
  ) {
    await this.notificationsService.subscribe(subscribtionDto, userId);
  }

  @Delete()
  async unSubscribe(@Body('roomName', NameValidationPipe) roomName: string) {
    await this.notificationsService.unSubscribe(roomName);
  }
}
