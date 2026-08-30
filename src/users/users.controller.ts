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
  Delete,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterProfessorDto } from './dto/register-professor.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from './entities/user.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get(':id/profile')
  @Roles(Role.ADMIN, Role.STUDENT, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async getProfile(
    @Param('id') id: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return this.usersService.getProfile(+id, req.user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(
    @Param('id') id: string,
    @Request()
    req: Request & { user: { id: number; email: string; role: string } },
  ) {
    const requesterId = req.user.id;
    return this.usersService.remove(+id, requesterId);
  }

  @Post('register-professor')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  registerProfessor(@Body() registerProfessorDto: RegisterProfessorDto) {
    return this.usersService.registerProfessor(registerProfessorDto);
  }

  @Post('register-admin')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  registerAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.registerAdmin(createUserDto);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
    @Request()
    req: Request & { user: { id: number; email: string; role: string } },
  ) {
    const requesterId = req.user.id;
    return this.usersService.updateStatus(
      +id,
      updateUserStatusDto.isActive,
      requesterId,
    );
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.STUDENT, Role.PROFESSOR)
  @UseGuards(AuthGuard, RolesGuard)
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: Request & { user: JwtPayload },
  ) {
    const requesterId = req.user.id;
    return this.usersService.updateProfile(+id, updateUserDto, requesterId);
  }
}
