import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { User, UserDocument } from './schema'
import { UserDto } from './dto'
import { CreateUserParam, ConstructUserProps } from './typings'
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  constructUser = (props: ConstructUserProps) => {
    const { user: dbUser } = props
    const user = dbUser
    if (dbUser?.id) {
      user.id = dbUser?.id
      user.email = dbUser?.email
      user.firstName = dbUser?.firstName
      user.lastName = dbUser?.lastName
      user.phone = dbUser?.phone
      user.createdDate = dbUser?.createdDate
    } else {
      user.error = dbUser?.error ?? 'Something went wrong'
    }
    return user
  }

  async getUserProfile(
    params: CreateUserParam,
    newUser: UserDto,
    session: Record<string, any>,
  ): Promise<User> {
    let response = new User()
    let responseMessage = 'success'

    const userId = session?.userId
    if (userId) {
      try {
        const user = await this.userModel.findOne({ id: userId }).exec()
        if (user) {
          response = user
        } else {
          response.error = 'User not found'
          response.responseMessage = 'failure'
        }
      } catch (e) {
        responseMessage = e
        console.log('createUser exception ', e)
      }
    } else {
      response.error = 'User not found'
      responseMessage = 'failure'
      console.log('user id ', userId)
    }

    const user = this.constructUser({ user: response })
    user.responseMessage = responseMessage

    return user
  }

  async loginUser(params: CreateUserParam, newUser: UserDto): Promise<User> {
    let response = new User()
    let responseMessage = 'success'
    try {
      const existingUser = await this.userModel
        .findOne({ email: newUser?.email })
        .exec()
      if (
        !existingUser ||
        (existingUser && existingUser?.password != newUser.password)
      ) {
        response.error = 'Please check the user name and password'
        response.responseMessage = 'failure'
      } else {
        response = existingUser
      }
    } catch (e) {
      responseMessage = e
      console.log('createUser exception ', e)
    }

    const user = this.constructUser({ user: response })
    user.responseMessage = responseMessage

    return user
  }

  userIdGenerator = async (): Promise<string> => {
    const newUserId = uuidv4()?.replace(/-/g, '')?.substr(0, 15)
    const existingUser = await this.userModel.findOne({ id: newUserId }).exec()

    if (existingUser) {
      return await this.userIdGenerator()
    }
    return newUserId
  }

  async createUser(
    params: CreateUserParam,
    newUser: UserDto,
    session: Record<string, any>,
  ): Promise<User> {
    let response = new User()
    let responseMessage = 'success'
    try {
      const existingUser = await this.userModel
        .findOne({ email: newUser?.email })
        .exec()
      if (existingUser) {
        response.error = 'User already exists'
        response.responseMessage = 'failure'
      } else {
        newUser.id = await this.userIdGenerator()
        response = await this.userModel.create(newUser)
      }
    } catch (e) {
      responseMessage = e
      console.log('createUser exception ', e)
    }

    const user = this.constructUser({ user: response })
    user.responseMessage = responseMessage

    return user
  }
}
