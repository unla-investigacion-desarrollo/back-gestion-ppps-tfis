import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ppp_settings')
export class PppSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 500 })
  generalDriveUrl: string | null;
}
