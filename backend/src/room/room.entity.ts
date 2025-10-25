import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Room {
  @PrimaryColumn()
  name: string;

  @OneToMany(() => User, (user) => user.room)
  users: User[];

  @Column({ array: true, default: [] })
  tools: string[];
}
