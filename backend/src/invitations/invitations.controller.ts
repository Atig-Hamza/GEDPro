import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('MANAGE_USERS')
  @Post()
  async create(@Body() createInvitationDto: CreateInvitationDto, @Request() req) {
    return this.invitationsService.createInvitation(createInvitationDto.email, req.user.organizationId);
  }
}
