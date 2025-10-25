import { Body, Controller, Delete, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('verify-email')
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.userService.verifyEmail(verifyEmailDto);
  }

  @Post('resend-code')
  resendCode(@Body('email') email: string) {
    return this.userService.resendVerificationCode(email);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOneById(id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }

  @Post('join-room')
  async joinRoom(@Body('id') id: string, @Body('roomName') roomName: string) {
    await this.userService.joinRoom(id, roomName);
  }

  @Delete('leave-room')
  async leaveRoom(@Body('id') id: string) {
    await this.userService.leaveRoom(id);
  }
}
