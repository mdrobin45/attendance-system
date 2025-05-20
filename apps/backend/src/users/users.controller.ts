import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('create')
  create(@Body() body: { email: string; password: string }) {
    return this.usersService.createEmployee(body.email, body.password);
  }
}
