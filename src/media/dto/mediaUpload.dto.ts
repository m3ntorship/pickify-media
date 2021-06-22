import { IsIn, IsUUID } from 'class-validator';
import { entityType } from 'src/shared/enums/entityType.enum';

export class MediaUploadDTO {
  @IsIn([entityType.OPTION, entityType.POST, entityType.OPTION_GROUP])
  entity_type: string;

  @IsUUID(4, { message: 'entity id is not a valid uuid' })
  entity_id: string;
}
