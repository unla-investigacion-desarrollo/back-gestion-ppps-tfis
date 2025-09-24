import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

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
}
