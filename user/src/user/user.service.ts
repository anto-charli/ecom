import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schema'
import { UserDto } from './dto'
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(params, newUser: UserDto): Promise<User> {
    let response: User
    let responseMessage = 'success'
    try {
      response = await this.userModel.create(newUser)
    } catch (e) {
      responseMessage = e
    }

    const user = response
    user.email = response?.email
    user.firstName = response?.firstName
    user.lastName = response?.lastName
    user.phone = response?.phone
    user.createdDate = response?.createdDate
    user.responseMessage = responseMessage
    return user
  }
}
