import { IsNotEmpty } from 'class-validator'
export class UserDto {
  id: number

  @IsNotEmpty()
  firstName: string

  @IsNotEmpty()
  lastName: string

  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  password: string

  @IsNotEmpty()
  phone: string

  @IsNotEmpty()
  type: string

  createdDate: Date
}
