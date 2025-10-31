import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notifications } from './notifications.entity';
import { SubscriptionDto } from './dto/subscribtion';
import { validateEnv } from '../config/env.config';
import { config } from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomService } from '../room/room.service';
import { Room } from '../room/room.entity';
import * as webPush from 'web-push';
import { PushSubscription } from 'web-push';
import { NotificationPayload } from './dto/notificationPayload';
import { UserService } from '../user/user.service';

config();
const env = validateEnv(process.env);

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(
    @InjectRepository(Notifications)
    private notificationsRepository: Repository<Notifications>,
    private readonly roomService: RoomService,
    private userService: UserService,
  ) {}

  vapidKey: string = env.VAPID_KEY_PUBLIC;

  onModuleInit(): void {
    const vapidPublicKey = env.VAPID_KEY_PUBLIC;
    const vapidPrivateKey = env.VAPID_KEY_PRIVATE;
    const vapidSubject = env.VAPID_SUBJECT;

    webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
  }

  async getUserStatus(userId: string) {
    const userNotification = await this.notificationsRepository.findOne({
      where: { userId },
    });
    return !!userNotification && !!userNotification.url;
  }

  async subscribe(subscriptionDto: SubscriptionDto, userId: string) {
    let userNotification = await this.notificationsRepository.findOne({
      where: { userId },
    });
    if (!userNotification) {
      const user = await this.userService.findOneById(userId);
      userNotification = this.notificationsRepository.create({
        userId: user.id,
      });
    }
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
    await this.notificationsRepository.save(userNotification);
  }

  async getRoomSubscriptions(roomName: string, exeptedId: string[]) {
    const room: Room = await this.roomService.findByName(roomName);

    const userIds = room
      .userIds()
      .filter((userId) => !exeptedId.includes(userId));

    const subscriptions: PushSubscription[] = [];
    for (const id of userIds) {
      const notification = await this.notificationsRepository.findOne({
        where: { userId: id },
      });
      if (
        notification &&
        notification.url &&
        notification.authKey &&
        notification.encryptionKey
      ) {
        const subscription: PushSubscription = {
          endpoint: notification.url,
          keys: {
            p256dh: notification.encryptionKey,
            auth: notification.authKey,
          },
        };
        subscriptions.push(subscription);
      }
    }
    return subscriptions;
  }

  async sendRoomNotification(roomNotification: {
    roomName: string;
    senderId: string;
    payload: NotificationPayload;
  }) {
    const subscriptions: PushSubscription[] = await this.getRoomSubscriptions(
      roomNotification.roomName,
      [roomNotification.senderId],
    );

    await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          await webPush.sendNotification(
            subscription,
            JSON.stringify(roomNotification.payload),
          );
        } catch (e) {
          console.log(e);
        }
      }),
    );
  }
}
