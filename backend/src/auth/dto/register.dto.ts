import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ required: false })
  firstName?: string;

  @ApiProperty({ required: false })
  lastName?: string;
}
