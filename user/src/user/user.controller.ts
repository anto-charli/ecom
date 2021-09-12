import { Controller, Get, Session, Post, Param, Body } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './schema'
import { CreateUserParam } from './typings'
import { UserDto } from './dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Session() session: Record<string, any>) {
    session.visits = session.visits ? session.visits + 1 : 1
    session.userId =
      session?.userId || parseInt((Math.random() * 1000).toString(), 10)
    return session
  }

  @Post('')
  createUser(
    @Session() session: Record<string, any>,
    @Param() params: CreateUserParam,
    @Body() body: UserDto,
  ): Promise<User> {
    return this.userService.createUser(params, body)
  }
}
