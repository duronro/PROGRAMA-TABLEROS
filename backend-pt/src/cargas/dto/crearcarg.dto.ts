import { IsInt, IsNotEmpty, IsDateString, IsOptional, IsString, Min } from 'class-validator';

export class CrearCargaDto {
  @IsInt()
  @Min(1)
  maquinaId: number;

  @IsInt()
  @Min(1)
  folioCarga: number;

  @IsDateString()
  fechaHoraInicio: string;

  @IsOptional()
  @IsString()
  recetaProceso?: string;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}