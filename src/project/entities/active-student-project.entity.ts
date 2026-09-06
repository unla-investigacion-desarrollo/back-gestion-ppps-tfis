import { Student } from 'src/users/entities/student.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class ActiveStudentProject {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.activeProjects)
  @JoinColumn({ name: 'student_id_user', referencedColumnName: 'id_user' })
  student: Student;

  @ManyToOne(() => Project, (project) => project.activeStudents)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ default: false })
  active: boolean;
}
