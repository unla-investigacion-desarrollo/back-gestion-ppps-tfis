import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ActiveStudentProject } from 'src/project/entities/active-student-project.entity';

@Entity()
export class Student {
  @PrimaryColumn()
  id_user: number;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'id_user' })
  user: User;

  @Column()
  yearOfAdmission: number;

  @Column()
  completedCoursesWithFinal: number;

  @Column()
  completedCoursesWithoutFinal: number;

  @OneToMany(() => ActiveStudentProject, (app) => app.student)
  activeProjects: ActiveStudentProject[];
}
