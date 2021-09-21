import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schema'
import { UserDto } from './dto'
import { CreateUserParam } from './typings'
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(params: CreateUserParam, newUser: UserDto): Promise<User> {
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
        response = await this.userModel.create(newUser)
      }
    } catch (e) {
      responseMessage = e
      console.log('createUser exception ', e)
    }

    const user = response
    if (response?.email) {
      user.email = response?.email
      user.firstName = response?.firstName
      user.lastName = response?.lastName
      user.phone = response?.phone
      user.createdDate = response?.createdDate
    } else {
      user.error = response?.error
    }
    user.responseMessage = responseMessage

    return user
  }
}
