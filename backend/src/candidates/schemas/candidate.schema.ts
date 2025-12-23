import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CandidateDocument = Candidate & Document;

@Schema({ timestamps: true })
export class Candidate {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  cvPath: string;

  @Prop()
  originalName: string;

  @Prop()
  mimeType: string;

  @Prop()
  ocrText: string;

  @Prop([String])
  skills: string[];
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
