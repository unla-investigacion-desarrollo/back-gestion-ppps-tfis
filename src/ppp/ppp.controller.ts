/**
 * Archivo generado con NestJS CLI y luego modificado
 * para agregar funcionalidades especificas
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
  Delete,
} from '@nestjs/common';
import { PppService } from './ppp.service';
import { CreatePppProposalDto } from './dto/create-ppp-proposal.dto';
import { ApplyProposalDto } from './dto/apply-ppp.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';
import { UpdateProposalStatusDto } from './dto/update-proposal-status.dto';
import { UpdatePppSettingDto } from './dto/update-ppp-setting.dto';

@Controller('ppp')
export class PppController {
  constructor(private readonly pppService: PppService) {}

  @Post('proposals')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async createProposal(
    @Body() dto: CreatePppProposalDto,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.pppService.createProposal(dto, req.user);
  }

  @Get('proposals')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  async findAllProposals(@Request() req: Request & { user: JwtPayload }) {
    return await this.pppService.findAllProposals(req.user);
  }

  @Get('proposals/:id')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async findProposalWithApplicants(
    @Param('id') id: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.pppService.findProposalWithApplicants(+id, req.user);
  }

  @Post('proposals/:id/apply')
  @Roles(Role.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  async applyToProposal(
    @Param('id') id: string,
    @Body() dto: ApplyProposalDto,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.pppService.applyToProposal(+id, dto, req.user);
  }

  @Patch('proposals/:proposalId/students/:studentId/accept')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async acceptApplicant(
    @Param('proposalId') proposalId: string,
    @Param('studentId') studentId: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.pppService.acceptApplicant(
      +proposalId,
      +studentId,
      req.user,
    );
  }

  @Patch('proposals/:proposalId/students/:studentId/reject')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async rejectApplicant(
    @Param('proposalId') proposalId: string,
    @Param('studentId') studentId: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.pppService.rejectApplicant(
      +proposalId,
      +studentId,
      req.user,
    );
  }

  @Patch('proposals/:id/status')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async changeProposalStatus(
    @Param('id') id: string,
    @Body() dto: UpdateProposalStatusDto,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.pppService.changeProposalStatus(+id, dto, req.user);
  }

  @Get('general-drive')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  async getDriveUrl() {
    return await this.pppService.getDriveUrl();
  }

  @Patch('general-drive')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async updateDriveUrl(
    @Body() dto: UpdatePppSettingDto,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.pppService.updateDriveUrl(dto, req.user);
  }

  @Post('external')
  @Roles(Role.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  async createExternal(@Request() req: Request & { user: JwtPayload }) {
    return await this.pppService.createExternal(req.user);
  }

  @Get()
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async findAllPpp(@Request() req: Request & { user: JwtPayload }) {
    return await this.pppService.findAllPpp(req.user);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(
    @Param('id') id: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.pppService.findOne(+id, req.user);
  }

  @Patch(':id/notify-sent')
  @Roles(Role.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  async notifyDocumentationSent(
    @Param('id') id: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.pppService.notifyDocumentationSent(+id, req.user);
  }

  @Patch(':id/observe')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async markAsObserved(
    @Param('id') id: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.pppService.markAsObserved(+id, req.user);
  }

  @Patch(':id/approve')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async markAsApproved(
    @Param('id') id: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.pppService.markAsApproved(+id, req.user);
  }

  @Patch(':id/disapprove')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async markAsDisapproved(
    @Param('id') id: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.pppService.markAsDisapproved(+id, req.user);
  }

  @Patch(':id/abandon')
  @Roles(Role.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  async abandonPpp(
    @Param('id') id: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.pppService.abandonPpp(+id, req.user);
  }

  @Patch(':id/siu-load')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async loadToSiu(
    @Param('id') id: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.pppService.loadToSiu(+id, req.user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Param('id') id: string) {
    return await this.pppService.remove(+id);
  }
}
