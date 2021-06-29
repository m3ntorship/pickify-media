import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { getNow } from './utils/datetime';

export const MEDIA_SCHEMA = 'pickify_media';

export default abstract class Model extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  uuid: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @BeforeInsert()
  addInteractionDates() {
    const date = getNow().toDate();
    this.created_at = date;
    this.updated_at = date;
  }

  @BeforeUpdate()
  addUpdatedAt() {
    const date = getNow().toDate();
    this.updated_at = date;
  }

  constructor(model?: Partial<any>) {
    super();
    Object.assign(this, model);
  }

  toJSON() {
    return { ...this, id: undefined };
  }
}
