import Model, { MEDIA_SCHEMA } from '../../shared/entity.model';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'media', schema: MEDIA_SCHEMA })
export class Media extends Model {
  @Column()
  uploaded: boolean;

  @Column({ nullable: true })
  original_url: string;

  @Column()
  name: string;
}
