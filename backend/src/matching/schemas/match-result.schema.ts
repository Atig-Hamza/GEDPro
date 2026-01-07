import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MatchResultDocument = MatchResult & Document;

@Schema({ timestamps: true })
export class MatchResult {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Job', required: true })
  jobId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Candidate', required: true })
  candidateId: string;

  @Prop({ required: true })
  score: number;

  @Prop([String])
  matchedSkills: string[];
}

export const MatchResultSchema = SchemaFactory.createForClass(MatchResult);
