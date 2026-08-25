import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ActiveProfessorProject } from './active-professor-project.entity';
import { ActiveStudentProject } from './active-student-project.entity';

export enum ProjectStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  FINALIZED = 'finalized',
}

export enum ProjectType {
  DEVELOPMENT = 'development',
  RESEARCH = 'research',
  EXTENSION = 'extension',
  OTHER = 'other',
}

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ProjectType,
    default: ProjectType.DEVELOPMENT,
  })
  projectType: ProjectType;

  @Column({ nullable: true })
  customProjectType?: string;

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
}
