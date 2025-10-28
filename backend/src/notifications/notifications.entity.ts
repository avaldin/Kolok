import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Notifications {
  @PrimaryColumn()
  userId: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar', nullable: true })
  url: string | null;

  @Column({ type: 'varchar', nullable: true })
  encryptionKey: string | null;

  @Column({ type: 'varchar', nullable: true })
  authKey: string | null;
}
