import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { MatchResult, MatchResultSchema } from './schemas/match-result.schema';
import { JobsModule } from '../jobs/jobs.module';
import { CandidatesModule } from '../candidates/candidates.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MatchResult.name, schema: MatchResultSchema }]),
    JobsModule,
    CandidatesModule,
  ],
  controllers: [MatchingController],
  providers: [MatchingService],
})
export class MatchingModule {}
