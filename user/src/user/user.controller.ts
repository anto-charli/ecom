import { Controller, Get, Session, Post, Param, Body } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './schema'
import { CreateUserParam } from './typings'
import { UserDto } from './dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get('')
  // findAll(@Session() session: Record<string, any>) {
  //   session.visits = session.visits ? session.visits + 1 : 1
  //   session.userId =
  //     session?.userId || parseInt((Math.random() * 1000).toString(), 10)
  //   return session
  // }

  @Get('profile')
  getUserProfile(
    @Session() session: Record<string, any>,
    @Param() params: CreateUserParam,
    @Body() body: UserDto,
  ): Promise<User> {
    return this.userService.getUserProfile(params, body, session)
  }

  @Post('login')
  async loginUser(
    @Session() session: Record<string, any>,
    @Param() params: CreateUserParam,
    @Body() body: UserDto,
  ): Promise<User> {
    const user = await this.userService.loginUser(params, body)
    return this.setSessionAndReturnUser(session, user)
  }

  @Post('')
  async createUser(
    @Session() session: Record<string, any>,
    @Param() params: CreateUserParam,
    @Body() body: UserDto,
  ): Promise<User> {
    const user = await this.userService.createUser(params, body, session)
    return this.setSessionAndReturnUser(session, user)
  }

  setSessionAndReturnUser(session: Record<string, any>, user: User): User {
    session.userId = user.id ?? ''
    return user
  }
}
