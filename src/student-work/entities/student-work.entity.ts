import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from 'src/project/entities/project.entity';
import { Professor } from 'src/users/entities/professor.entity';

export enum StudentWorkStatus {
  PENDING_REVIEW = 'pending_review',
  OBSERVED = 'observed',
  APPROVED = 'approved',
  DISAPPROVED = 'disapproved',
  ABSENT = 'absent',
}

@Entity()
export class StudentWork {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  documentUrl: string;

  @Column({ nullable: true })
  driveFolderUrl: string | null;

  @Column({
    type: 'enum',
    enum: StudentWorkStatus,
    default: StudentWorkStatus.PENDING_REVIEW,
  })
  status: StudentWorkStatus;

  @Column({ type: 'int', nullable: true })
  qualification: number | null;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Professor, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'last_reviewed_by_professor_id' })
  lastReviewedBy: Professor | null;

  @Column({ type: 'timestamp', nullable: true })
  lastReviewedAt: Date | null;

  @Column({ type: 'boolean', default: false })
  tutoringRequested: boolean;

  @ManyToOne(() => Professor, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'last_tutored_by_professor_id' })
  lastTutoredBy: Professor | null;

  @Column({ type: 'timestamp', nullable: true })
  lastTutoredAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
