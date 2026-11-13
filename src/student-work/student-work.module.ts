import { Module } from '@nestjs/common';
import { StudentWorkService } from './student-work.service';
import { StudentWorkController } from './student-work.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentWork } from './entities/student-work.entity';
import { Project } from 'src/project/entities/project.entity';
import { Professor } from 'src/users/entities/professor.entity';
import { Student } from 'src/users/entities/student.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ActiveStudentProject } from 'src/project/entities/active-student-project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentWork,
      Project,
      Professor,
      Student,
      ActiveStudentProject,
    ]),
    AuthModule,
  ],
  controllers: [StudentWorkController],
  providers: [StudentWorkService],
  exports: [StudentWorkService],
})
export class StudentWorkModule {}
