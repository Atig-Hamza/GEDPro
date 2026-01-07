import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new job offer' })
  async create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all job offers' })
  async findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a job offer by ID' })
  async findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }
}
