import { IsUUID } from 'class-validator';

export class GetMediaDTO {
  @IsUUID(4, { message: 'id is not a valid uuid' })
  id: string;
}
