import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginUserDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    console.log(`1`);
    return this.userService.login(loginUserDto);
    console.log(`6`);
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    const id = await this.userService.verifyEmail(verifyEmailDto);
    return { id: id };
  }

  @Post('resend-code')
  resendCode(@Body('email') email: string) {
    return this.userService.resendVerificationCode(email);
  }
}
