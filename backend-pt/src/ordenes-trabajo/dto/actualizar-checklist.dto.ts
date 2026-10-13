// actualizar-checklist.dto.ts
import { IsBoolean, IsOptional } from 'class-validator';

export class ActualizarChecklistDto {
  @IsOptional() @IsBoolean() herramientas?: boolean;
  @IsOptional() @IsBoolean() consumibles?: boolean;
  @IsOptional() @IsBoolean() procedimiento?: boolean;
  @IsOptional() @IsBoolean() ejecutado?: boolean;
}