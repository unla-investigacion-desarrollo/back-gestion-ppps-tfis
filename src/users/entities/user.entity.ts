import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  ADMIN = 'admin',
  PROFESSOR = 'professor',
  STUDENT = 'student',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  dni: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.STUDENT })
  role: Role;
}
