import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  room: string;
}
