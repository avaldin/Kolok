import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './room/room.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { validateEnv } from './config/env.config';
import { config } from 'dotenv';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { NotificationsModule } from './notifications/notifications.module';

config();

const envConfig = validateEnv(process.env);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: envConfig.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      migrationsRun: true,
      ssl: { rejectUnauthorized: false },
    }),
    RoomModule,
    ShoppingListModule,
    UserModule,
    MailModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
