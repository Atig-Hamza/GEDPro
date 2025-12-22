import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invitation, InvitationDocument } from './schemas/invitation.schema';
import * as crypto from 'crypto';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectModel(Invitation.name) private invitationModel: Model<InvitationDocument>,
  ) {}

  async findByToken(token: string): Promise<Invitation | null> {
    return this.invitationModel.findOne({ token, isUsed: false }).exec();
  }

  async markAsUsed(id: string): Promise<void> {
    await this.invitationModel.findByIdAndUpdate(id, { isUsed: true }).exec();
  }

  async createInvitation(email: string, organizationId: string): Promise<Invitation> {
    const token = crypto.randomUUID();
    return this.invitationModel.create({
      email,
      organizationId,
      token,
    });
  }
  
  async create(email: string, organizationId: string, token: string): Promise<Invitation> {
      return this.invitationModel.create({ email, organizationId, token });
  }
}
