import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterProfessorDto } from './dto/register-professor.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from './entities/user.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  /* @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  } */

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('register-professor')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  registerProfessor(
    @Body() registerProfessorDto: RegisterProfessorDto,
    @Request() req: Request & { user: JwtPayload },
  ) {
    return this.usersService.registerProfessor(registerProfessorDto);
  }
}
