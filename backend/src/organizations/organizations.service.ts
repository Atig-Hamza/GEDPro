import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Organization, OrganizationDocument } from './schemas/organization.schema';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name) private organizationModel: Model<OrganizationDocument>,
  ) {}

  async create(name: string, ownerId: Types.ObjectId): Promise<Organization> {
    const newOrg = new this.organizationModel({ name, ownerId });
    return newOrg.save();
  }

  async findById(id: string): Promise<Organization | null> {
    return this.organizationModel.findById(id).exec();
  }
}
