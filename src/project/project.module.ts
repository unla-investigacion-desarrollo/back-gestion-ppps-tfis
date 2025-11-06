/**
 * Archivo generado con NestJS CLI
 * Comando utilizado: nest g module project
 * Este módulo fue generado automáticamente y luego modificado para incluir
 * los imports y exports necesarios.
 */

import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ActiveProfessorProject } from './entities/active-professor-project.entity';
import { ActiveStudentProject } from './entities/active-student-project.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Professor } from 'src/users/entities/professor.entity';
import { Student } from 'src/users/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ActiveProfessorProject,
      ActiveStudentProject,
      Professor,
      Student,
    ]),
    AuthModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
