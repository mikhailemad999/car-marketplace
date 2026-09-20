import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.auditLogs, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  action: string;

  @Column()
  entity: string;

  @Column({ name: 'entity_id', nullable: true })
  entityId: number;

  @Column({ type: 'json', nullable: true })
  details: Record<string, any>;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;
}
