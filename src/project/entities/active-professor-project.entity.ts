import { Professor } from 'src/users/entities/professor.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class ActiveProfessorProject {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Professor, (professor) => professor.activeProjects)
  professor: Professor;

  @ManyToOne(() => Project, (project) => project.activeProfessors)
  project: Project;

  @Column({ default: true })
  active: boolean;
}
