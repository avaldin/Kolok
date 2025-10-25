import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Notifications {
  @PrimaryColumn()
  userId: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  url: string | null;

  @Column({ nullable: true })
  encryptionKey: string | null;

  @Column({ nullable: true })
  authKey: string | null;
}
