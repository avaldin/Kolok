import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notifications } from './notifications.entity';
import { SubscriptionDto } from './dto/subscribtion';

@Injectable()
export class NotificationsService {
  constructor(private notificationsRepository: Repository<Notifications>) {}

  async subscribe(subscribtionDto: SubscriptionDto, userId: string) {
    const userNotification = await this.notificationsRepository.findOne({
      where: { userId },
    });
    if (!userNotification)
      throw new NotFoundException(`this user doesn't exist`);
    userNotification.url = subscribtionDto.url;
    userNotification.authKey = subscribtionDto.keys.auth;
    userNotification.encryptionKey = subscribtionDto.keys.p256dh;
  }

  async unSubscribe(userId: string) {
    const userNotification = await this.notificationsRepository.findOne({
      where: { userId: userId },
    });
    if (!userNotification)
      throw new NotFoundException(`this user doesn't exist`);
    userNotification.url = null;
    userNotification.authKey = null;
    userNotification.encryptionKey = null;
  }

  async getUserNotificationsData(userId: string) {
    const userNotification = await this.notificationsRepository.findOne({
      where: { userId },
    });
    if (!userNotification)
      throw new NotFoundException(`this user doesn't exist`);
    return userNotification;
  }
}
