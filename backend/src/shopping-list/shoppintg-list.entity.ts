import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Room } from '../room/room.entity';

@Entity()
export class ShoppingList {
  @PrimaryColumn()
  roomName: string;

  @OneToOne(() => Room, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomName', referencedColumnName: 'name' })
  room: Room;

  @Column('text', { array: true, default: [] })
  items: string[];
}
