import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserService } from './user.service';
import { ActiveUser } from 'src/auth/active-user.decorator';
import { ActiveUserData } from 'src/auth/auth.interfaces';

@Controller('v1/user')
// TODO: Customize error response data sent by these guards to be in the resposne format
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-user')
  async getUser(@ActiveUser() activeUser: ActiveUserData) {
    return this.userService.getUser(activeUser);
  }
}
