import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailService: MailService,
  ) {}

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async create(createUserDto: CreateUserDto): Promise<string> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Cet email est déjà utilisé');
    }

    const verificationCode = this.generateVerificationCode();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(
      verificationCodeExpires.getMinutes() + 15,
    ); // attention si getMinute + 15 > 59

    const user = this.userRepository.create({
      email: createUserDto.email,
      name: createUserDto.name,
      verificationCode,
      verificationCodeExpires,
      isEmailVerified: false,
    });

    await this.userRepository.save(user);

    await this.mailService.sendVerificationEmail(user.email, verificationCode);

    return user.id;
  }

  // async connect() {
  //
  // }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.findByEmail(verifyEmailDto.email);

    if (user.isEmailVerified || !user.verificationCodeExpires) {
      throw new BadRequestException('Email déjà vérifié');
    }

    if (new Date() > user.verificationCodeExpires) {
      throw new BadRequestException('Le code a expiré');
    }

    if (user.verificationCode !== verifyEmailDto.code) {
      throw new BadRequestException('Code invalide');
    }

    user.isEmailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;

    await this.userRepository.save(user);
    //jwt
  }

  async resendVerificationCode(email: string) {
    const user = await this.findByEmail(email);

    if (user.isEmailVerified) {
      throw new BadRequestException('Email déjà vérifié');
    }

    // Générer un nouveau code
    const verificationCode = this.generateVerificationCode();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(
      verificationCodeExpires.getMinutes() + 15,
    );

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;

    await this.userRepository.save(user);
    await this.mailService.sendVerificationEmail(user.email, verificationCode);
    //jwt
  }

  // findAll() {
  //   return `This action returns all user`;
  // }

  async findOneById(id: string) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }
    return user;
  }

  async getRoom(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }
    return user.roomName;
  }

  async joinRoom(roomName: string, userId: string) {
    const user = await this.findOneById(userId);
    if (user.roomName != null)
      throw new ConflictException(`vous etes deja dans une room`);
    user.roomName = roomName;
    await this.userRepository.save(user);
  }

  async leaveRoom(userId: string) {
    const user = await this.findOneById(userId);
    if (user.roomName === null)
      throw new ConflictException(`vous n'etes pas dans une room`);
    user.roomName = null;
    await this.userRepository.save(user);
  }
}
