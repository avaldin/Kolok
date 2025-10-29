import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { MailModule } from '../mail/mail.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([User]), MailModule, NotificationsModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
