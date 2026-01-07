import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop([String])
  requiredSkills: string[];

  @Prop()
  experienceLevel: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);
