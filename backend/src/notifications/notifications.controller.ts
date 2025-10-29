import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SubscriptionDto } from './dto/subscribtion';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('vapid-key')
  vapidKey() {
    return this.notificationsService.vapidKey;
  }

  @Post()
  async subscribe(
    @Body('userId') userId: string,
    @Body('subscriptionDto') subscriptionDto: SubscriptionDto,
  ) {
    await this.notificationsService.subscribe(subscriptionDto, userId);
  }

  @Delete()
  async unSubscribe(@Body('userId') userId: string) {
    await this.notificationsService.unSubscribe(userId);
  }
}
