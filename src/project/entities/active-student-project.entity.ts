import { Student } from 'src/users/entities/student.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class ActiveStudentProject {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.activeProjects)
  student: Student;

  @ManyToOne(() => Project, (project) => project.activeStudents)
  project: Project;

  @Column({ default: true })
  active: boolean;
}
