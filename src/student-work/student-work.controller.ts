import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StudentWorkService } from './student-work.service';
import { CreateStudentWorkDto } from './dto/create-student-work.dto';
import { QualifyWorkDto } from './dto/qualify-work.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';
import { UpdateStudentWorkDto } from './dto/update-student-work.dto';

@Controller('student-work')
export class StudentWorkController {
  constructor(private readonly studentWorkService: StudentWorkService) {}

  @Post('project/:projectId')
  @Roles(Role.STUDENT, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async create(
    @Param('projectId') projectId: string,
    @Body() createStudentWorkDto: CreateStudentWorkDto,
  ) {
    return await this.studentWorkService.create(
      +projectId,
      createStudentWorkDto,
    );
  }

  @Get('qualifications')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async findAllQualifications(@Request() req: Request & { user: JwtPayload }) {
    return await this.studentWorkService.findAllQualifications(req.user);
  }

  @Get('project/:projectId')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  async findOneByProject(
    @Param('projectId') projectId: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.studentWorkService.findOneByProject(+projectId, req.user);
  }

  @Patch(':id/mark-observed')
  @Roles(Role.PROFESSOR, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async markAsObserved(
    @Param('id') id: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.studentWorkService.markAsObserved(+id, req.user);
  }

  @Patch(':id/notify-advances')
  @Roles(Role.STUDENT, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async notifyAdvances(@Param('id') id: string) {
    return await this.studentWorkService.notifyAdvances(+id);
  }

  @Patch(':id/request-tutoring')
  @Roles(Role.STUDENT, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async requestTutoring(@Param('id') id: string) {
    return await this.studentWorkService.requestTutoring(+id);
  }

  @Patch(':id/mark-tutored')
  @Roles(Role.PROFESSOR, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async markAsTutored(
    @Param('id') id: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.studentWorkService.markAsTutored(+id, req.user);
  }

  @Patch(':id/qualify')
  @Roles(Role.PROFESSOR, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async qualify(
    @Param('id') id: string,
    @Body() qualifyDto: QualifyWorkDto,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return await this.studentWorkService.qualify(+id, qualifyDto, req.user);
  }

  @Patch(':id')
  @Roles(Role.STUDENT, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateStudentWorkDto,
    @Request() req: { user: JwtPayload },
  ) {
    return this.studentWorkService.updateUrls(+id, updateDto, req.user);
  }
}
