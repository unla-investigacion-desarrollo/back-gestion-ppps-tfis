import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from 'src/users/entities/student.entity';
import { PppProposal } from './ppp-proposal.entity';

export enum PppType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

export enum PppStatus {
  PENDING_APPLICATION = 'pending_application',
  APPLICATION_REJECTED = 'application_rejected',
  PENDING_DOCUMENTATION = 'pending_documentation',
  IN_REVIEW = 'in_review',
  OBSERVED = 'observed',
  APPROVED = 'approved',
  DISAPPROVED = 'disapproved',
  DROPPED_OUT = 'dropped_out',
}

@Entity('ppp')
export class Ppp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: PppType,
  })
  type: PppType;

  @Column({
    type: 'enum',
    enum: PppStatus,
  })
  status: PppStatus;

  @Column({ type: 'text', nullable: true })
  previousKnowledge: string;

  @Column({ name: 'is_siu_loaded', default: false })
  isSiuLoaded: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => PppProposal, (proposal) => proposal.applications, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'proposal_id' })
  proposal: PppProposal;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
