import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvitationDocument = Invitation & Document;

@Schema()
export class Invitation {
  @Prop({ required: true })
  email: string;

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ default: false })
  isUsed: boolean;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
