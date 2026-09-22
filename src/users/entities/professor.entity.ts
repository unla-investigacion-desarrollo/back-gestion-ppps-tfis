import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ActiveProfessorProject } from 'src/project/entities/active-professor-project.entity';

@Entity()
export class Professor {
  @PrimaryColumn()
  id_user: number;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'id_user' })
  user: User;

  @Column()
  specialization: string;

  @Column()
  isTutor: boolean;

  @OneToMany(() => ActiveProfessorProject, (app) => app.professor)
  activeProjects: ActiveProfessorProject[];
}
