import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Notifications {
  @PrimaryColumn()
  userId: string;

  @Column({ type: 'varchar', nullable: true })
  url: string | null;

  @Column({ type: 'varchar', nullable: true })
  encryptionKey: string | null;

  @Column({ type: 'varchar', nullable: true })
  authKey: string | null;
}
