/**
 * Archivo generado con NestJS CLI y luego modificado
 * para agregar funcionalidades especificas
 */
import { Module } from '@nestjs/common';
import { PppService } from './ppp.service';
import { PppController } from './ppp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ppp } from './entities/ppp.entity';
import { Student } from 'src/users/entities/student.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PppProposal } from './entities/ppp-proposal.entity';
import { Professor } from 'src/users/entities/professor.entity';
import { PppSetting } from './entities/ppp-setting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ppp,
      PppProposal,
      PppSetting,
      Student,
      Professor,
    ]),
    AuthModule,
  ],
  controllers: [PppController],
  providers: [PppService],
  exports: [PppService],
})
export class PppModule {}
