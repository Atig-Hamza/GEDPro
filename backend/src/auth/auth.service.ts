import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { InvitationsService } from '../invitations/invitations.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private organizationsService: OrganizationsService,
    private invitationsService: InvitationsService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOne(loginDto.email);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { 
      email: user.email, 
      sub: user['_id'],
      organizationId: user.organizationId,
      permissions: user.permissions
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findOne(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    if (registerDto.organizationName) {
      const user = await this.usersService.create({
        ...registerDto,
        password: hashedPassword,
        permissions: ['OWNER', 'MANAGE_ORGANIZATION', 'MANAGE_USERS', 'VIEW_CANDIDATES', 'MANAGE_OFFERS'], // Default owner permissions
      });

      const org = await this.organizationsService.create(registerDto.organizationName, user['_id']);

      await this.usersService.update(user['_id'], { organizationId: org['_id'] });

      return user;
    }

    if (registerDto.invitationToken) {
      const invitation = await this.invitationsService.findByToken(registerDto.invitationToken);
      if (!invitation) {
        throw new BadRequestException('Invalid or used invitation token');
      }

      if (invitation.email !== registerDto.email) {
         throw new BadRequestException('Email does not match invitation');
      }

      const user = await this.usersService.create({
        ...registerDto,
        password: hashedPassword,
        organizationId: invitation.organizationId,
        permissions: ['VIEW_CANDIDATES'],
      });

      await this.invitationsService.markAsUsed(invitation['_id']);

      return user;
    }

    throw new BadRequestException('Either organizationName or invitationToken must be provided');
  }
}
