import { IsNotEmpty } from 'class-validator'

export class LoginDto {
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  password: string
}
export class UserDto extends LoginDto {
  id: string

  @IsNotEmpty()
  firstName: string

  @IsNotEmpty()
  lastName: string

  @IsNotEmpty()
  phone: string

  @IsNotEmpty()
  type: string

  createdDate: Date
}
