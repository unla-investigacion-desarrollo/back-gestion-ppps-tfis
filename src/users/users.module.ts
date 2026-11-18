import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Student } from './entities/student.entity';
import { Professor } from './entities/professor.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';
import { Ppp } from 'src/ppp/entities/ppp.entity';
import { StudentWork } from 'src/student-work/entities/student-work.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Student, Professor, Ppp, StudentWork]),
    AuthModule,
    MailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
