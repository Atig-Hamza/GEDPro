import { ApiProperty } from '@nestjs/swagger';

export class CreateInvitationDto {
  @ApiProperty()
  email: string;
}
