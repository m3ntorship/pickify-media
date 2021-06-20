import { IsIn, IsUUID } from 'class-validator';

export class MediaUploadDTO {
  @IsIn(['option', 'post', 'option_group'])
  entity_type: string;

  @IsUUID(4, { message: 'entity id is not a valid uuid' })
  entity_id: string;
}
