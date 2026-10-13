// completar-orden.dto.ts
import { IsDateString, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CompletarOrdenDto {
  @IsDateString()
  fechaRealizado: string;

  @IsOptional() @IsInt() cargaFolio?: number; // obligatorio si el componente es por cargas
  @IsOptional() @IsString() responsable?: string;
  @IsOptional() @IsNumber() tiempoEmpleado?: number;
  @IsOptional() @IsInt() numeroCarro?: number;
  @IsOptional() @IsString() notas?: string;
}