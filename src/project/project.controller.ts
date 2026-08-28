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
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.projectService.create(createProjectDto, req.user);
  }

  @Get()
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  async findAll(@Request() req: Request & { user: JwtPayload }) {
    return await this.projectService.findAll(req.user);
  }

  @Get('my-requests')
  @Roles(Role.STUDENT, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async getMyRequests(@Request() req: Request & { user: JwtPayload }) {
    return this.projectService.getMyRequests(req.user);
  }

  @Get('my-projects')
  @Roles(Role.STUDENT, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async getMyActiveProjects(@Request() req: Request & { user: JwtPayload }) {
    return this.projectService.getMyActiveProjects(req.user);
  }

  @Get('types')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  async findAllProjectTypes() {
    return await this.projectService.findAllProjectTypes();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(
    @Param('id') id: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.projectService.findOne(+id, req.user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.projectService.update(+id, updateProjectDto, req.user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }

  @Post(':id/join-professor')
  @Roles(Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async requestJoinAsProfessor(
    @Param('id') id: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.projectService.requestJoinAsProfessor(+id, req.user);
  }

  @Post(':id/join-student')
  @Roles(Role.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  async requestJoinAsStudent(
    @Param('id') id: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.projectService.requestJoinAsStudent(+id, req.user);
  }

  @Patch(':id/approve-student/:studentRequestId')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async approveStudentRequest(
    @Param('id') id: string,
    @Param('studentRequestId') studentRequestId: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return this.projectService.approveStudentRequest(
      +id,
      +studentRequestId,
      req.user,
    );
  }

  @Delete(':id/reject-student/:studentRequestId')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async rejectStudentRequest(
    @Param('id') id: string,
    @Param('studentRequestId') studentRequestId: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return this.projectService.rejectStudentRequest(
      +id,
      +studentRequestId,
      req.user,
    );
  }

  @Patch(':id/approve-professor/:professorRequestId')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async approveProfessorRequest(
    @Param('id') id: string,
    @Param('professorRequestId') professorRequestId: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return this.projectService.approveProfessorRequest(
      +id,
      +professorRequestId,
      req.user,
    );
  }

  @Delete(':id/reject-professor/:professorRequestId')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async rejectProfessorRequest(
    @Param('id') id: string,
    @Param('professorRequestId') professorRequestId: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return this.projectService.rejectProfessorRequest(
      +id,
      +professorRequestId,
      req.user,
    );
  }
}
