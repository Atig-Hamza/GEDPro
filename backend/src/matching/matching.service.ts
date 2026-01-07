import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MatchResult, MatchResultDocument } from './schemas/match-result.schema';
import { JobsService } from '../jobs/jobs.service';
import { CandidatesService } from '../candidates/candidates.service';

@Injectable()
export class MatchingService {
  constructor(
    @InjectModel(MatchResult.name) private matchResultModel: Model<MatchResultDocument>,
    private readonly jobsService: JobsService,
    private readonly candidatesService: CandidatesService,
  ) {}

  async matchCandidatesForJob(jobId: string) {
    const job = await this.jobsService.findOne(jobId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const candidates = await this.candidatesService.findAll();
    const results: MatchResultDocument[] = [];

    for (const candidate of candidates) {
      const matchedSkills = candidate.skills.filter(skill =>
        job.requiredSkills.some(reqSkill => reqSkill.toLowerCase() === skill.toLowerCase())
      );

      let score = 0;
      if (job.requiredSkills.length > 0) {
        score = (matchedSkills.length / job.requiredSkills.length) * 100;
      }

      // Save or update match result
      const matchResult = await this.matchResultModel.findOneAndUpdate(
        { jobId: job._id, candidateId: candidate._id } as any,
        {
          jobId: job._id,
          candidateId: candidate._id,
          score,
          matchedSkills,
        },
        { upsert: true, new: true }
      ).populate('candidateId'); 

      if (matchResult) {
          results.push(matchResult as MatchResultDocument);
      }
    }

    // Sort by score descending
    return results.sort((a, b) => b.score - a.score);
  }

  async getMatches(jobId: string): Promise<MatchResultDocument[]> {
    return this.matchResultModel.find({ jobId }).sort({ score: -1 }).populate('candidateId').exec();
  }
}
