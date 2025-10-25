import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from '../room/room.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  verificationCode: string | null;

  @Column({ nullable: true })
  verificationCodeExpires: Date | null;

  @Column({ nullable: true })
  @ManyToOne(() => Room, (room) => room.users)
  room: Room;

  @Column({ nullable: true })
  roomName: string | null;
}
