import {
  IsInt,
  IsEnum,
  IsDateString,
  IsOptional,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';
import { TipoMantenimiento } from '../entidades/registro-mant.entity';

export class RegistrarMantenimientoDto {
  @IsInt()
  @Min(1)
  maquinaId: number;

  @IsInt()
  @Min(1)
  componenteId: number;

  @IsEnum(TipoMantenimiento)
  tipoMantenimiento: TipoMantenimiento;

  @IsDateString()
  fechaRealizado: string;

  @IsOptional()
  @IsInt()
  cargaFolio?: number; // obligatorio si el componente es por_cargas (se valida en el service)

  @IsOptional()
  @IsString()
  responsable?: string;

  @IsOptional()
  @IsNumber()
  tiempoEmpleado?: number;

  @IsOptional()
  @IsInt()
  numeroCarro?: number;

  @IsOptional()
  @IsString()
  notas?: string;
}