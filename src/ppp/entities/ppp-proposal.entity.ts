import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ppp } from './ppp.entity';

@Entity('ppp_proposals')
export class PppProposal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ length: 2000 })
  description: string;

  @Column({ nullable: true })
  driveFolderUrl: string;

  @Column({ type: 'text', nullable: true })
  internalNotes: string;

  @Column({ name: 'is_open', default: true })
  isOpen: boolean;

  @OneToMany(() => Ppp, (ppp) => ppp.proposal)
  applications: Ppp[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
