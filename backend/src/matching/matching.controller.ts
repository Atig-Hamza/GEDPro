import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MatchingService } from './matching.service';

@ApiTags('matching')
@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post(':jobId')
  @ApiOperation({ summary: 'Run matching algorithm for a job and return ranked candidates' })
  async matchCandidates(@Param('jobId') jobId: string) {
    return this.matchingService.matchCandidatesForJob(jobId);
  }
  
  @Get(':jobId')
  @ApiOperation({ summary: 'Get ranked candidates for a job (from database)' })
  async getMatches(@Param('jobId') jobId: string) {
      return this.matchingService.getMatches(jobId);
  }
}
