import { Professor } from 'src/users/entities/professor.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class ActiveProfessorProject {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Professor, (professor) => professor.activeProjects)
  @JoinColumn({ name: 'professor_id_user', referencedColumnName: 'id_user' })
  professor: Professor;

  @ManyToOne(() => Project, (project) => project.activeProfessors)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ default: false })
  active: boolean;
}
