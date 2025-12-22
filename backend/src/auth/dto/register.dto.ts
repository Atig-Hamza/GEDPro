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

  @ApiProperty({ required: false, description: 'Name of the organization to create (for first user)' })
  organizationName?: string;

  @ApiProperty({ required: false, description: 'Invitation token (for invited users)' })
  invitationToken?: string;
}
