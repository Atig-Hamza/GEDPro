import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Candidate, CandidateDocument } from './schemas/candidate.schema';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { OcrService } from '../ocr/ocr.service';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectModel(Candidate.name) private candidateModel: Model<CandidateDocument>,
    private readonly ocrService: OcrService,
  ) {}

  async create(createCandidateDto: CreateCandidateDto, file: Express.Multer.File): Promise<CandidateDocument> {
    const ocrText = await this.ocrService.extractText(file.path, file.mimetype);
    const skills = this.ocrService.extractSkills(ocrText);

    const newCandidate = new this.candidateModel({
      ...createCandidateDto,
      cvPath: file.path,
      originalName: file.originalname,
      mimeType: file.mimetype,
      uploadDate: new Date(),
      ocrText,
      skills,
    });
    return newCandidate.save();
  }

  async findAll(): Promise<CandidateDocument[]> {
    return this.candidateModel.find().exec();
  }
}
