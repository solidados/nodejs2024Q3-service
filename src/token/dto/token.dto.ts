import { IsUUID, IsString } from 'class-validator';

export class TokenDto {
  @IsUUID()
  userId: string;

  @IsString()
  login: string;
}
