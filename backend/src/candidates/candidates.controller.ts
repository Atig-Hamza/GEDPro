import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Get,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';

import { Candidate } from './schemas/candidate.schema';

@ApiTags('candidates')
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload CVs and create candidates' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        firstName: { type: 'string', nullable: true },
        lastName: { type: 'string', nullable: true },
        email: { type: 'string', nullable: true },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/candidates',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadCv(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createCandidateDto: CreateCandidateDto,
  ) {
    const candidates: Candidate[] = [];
    for (const file of files) {
      const candidate = await this.candidatesService.create(createCandidateDto, file);
      candidates.push(candidate);
    }
    return candidates;
  }

  @Get()
  @ApiOperation({ summary: 'Get all candidates' })
  async findAll() {
    return this.candidatesService.findAll();
  }
}
