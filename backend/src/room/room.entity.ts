import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { RoomDto } from './dto/room.dto';

@Entity()
export class Room {
  @PrimaryColumn()
  name: string;

  @OneToMany(() => User, (user) => user.room)
  users: User[];

  @Column({ type: 'text', array: true, default: [] })
  tools: string[];

  idArrayToNameArray(): string[] {
    return this.users.map((user) => user.name);
  }

  userIds(): string[] {
    return this.users.map((user) => user.id);
  }

  roomInformation(): RoomDto {
    const participants: string[] = this.idArrayToNameArray();

    return {
      name: this.name,
      participants: participants,
      tools: this.tools,
    };
  }
}
