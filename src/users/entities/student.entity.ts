import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

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
}
