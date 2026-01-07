import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel: Model<JobDocument>) {}

  async create(createJobDto: CreateJobDto): Promise<JobDocument> {
    const newJob = new this.jobModel(createJobDto);
    return newJob.save();
  }

  async findAll(): Promise<JobDocument[]> {
    return this.jobModel.find().exec();
  }

  async findOne(id: string): Promise<JobDocument | null> {
    return this.jobModel.findById(id).exec();
  }
}
