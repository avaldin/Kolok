import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Room {
  @PrimaryColumn()
  name: string;

  @Column('text', { array: true, default: [] })
  participants: string[];

  @Column('text', { array: true, default: [] })
  tool: string[];
}
