import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Student } from './entities/student.entity';
import { Professor } from './entities/professor.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ActiveStudentProject } from 'src/project/entities/active-student-project.entity';
import { ActiveProfessorProject } from 'src/project/entities/active-professor-project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Student,
      Professor,
      ActiveStudentProject,
      ActiveProfessorProject,
    ]),
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
