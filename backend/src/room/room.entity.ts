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
    const nameArray: string[] = this.users.map((user) => user.name);
    return nameArray;
  }

  roomInformation(): RoomDto {
    const participants: string[] = this.idArrayToNameArray();

    const roomDto: RoomDto = {
      name: this.name,
      participants: participants,
      tools: this.tools,
    };
    return roomDto;
  }
}
