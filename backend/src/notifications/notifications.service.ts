import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notifications } from './notifications.entity';
import { SubscriptionDto } from './dto/subscribtion';
import { validateEnv } from '../config/env.config';
import { config } from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';

config();
const env = validateEnv(process.env);

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private notificationsRepository: Repository<Notifications>,
  ) {}

  vapidKey: string = env.VAPID_KEY_PUBLIC;

  async create(user: User) {
    console.log(user);
    const notification = this.notificationsRepository.create({
      userId: user.id,
    });
    await this.notificationsRepository.save(notification);
  }

  async subscribe(subscriptionDto: SubscriptionDto, userId: string) {
    const userNotification = await this.notificationsRepository.findOne({
      where: { userId },
    });
    if (!userNotification)
      throw new NotFoundException(`this user doesn't exist`);
    userNotification.url = subscriptionDto.url;
    userNotification.authKey = subscriptionDto.auth;
    userNotification.encryptionKey = subscriptionDto.p256dh;
    await this.notificationsRepository.save(userNotification);
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
