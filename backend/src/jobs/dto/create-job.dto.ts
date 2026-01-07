import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ type: [String] })
  requiredSkills: string[];

  @ApiProperty({ required: false })
  experienceLevel?: string;
}
