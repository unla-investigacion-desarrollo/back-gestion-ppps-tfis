import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActiveProfessorProject } from './active-professor-project.entity';
import { ActiveStudentProject } from './active-student-project.entity';
import { StudentWork } from 'src/student-work/entities/student-work.entity';
import { ProjectType } from './project-type.entity';

export enum ProjectStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  FINALIZED = 'finalized',
}

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => ProjectType, (tp) => tp.projects, { eager: true })
  @JoinColumn({ name: 'project_type_id' })
  projectType: ProjectType;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PENDING,
  })
  status: ProjectStatus;

  @OneToMany(() => ActiveProfessorProject, (app) => app.project, {
    cascade: true,
  })
  activeProfessors: ActiveProfessorProject[];

  @OneToMany(() => ActiveStudentProject, (app) => app.project, {
    cascade: true,
  })
  activeStudents: ActiveStudentProject[];

  @OneToMany(() => StudentWork, (work) => work.project)
  studentWorks: StudentWork[];
}
