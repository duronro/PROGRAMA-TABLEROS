import {isString, IsNotEmpty, IsEnum, IsInt, IsOptional, Min, IsString} from 'class-validator';
import {TipoPeriodicidad} from '../entidades/comp.entity';

export class CrearCompDto{
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsEnum(TipoPeriodicidad)
    tipoPeriodicidad: TipoPeriodicidad;

    @IsInt()
    @Min(1)
    valorPeriodicidad: number;

    @IsOptional()
    tiempoEstandar?: number;

    @IsOptional()
    @IsString()
    metodoProcedimiento?: string;

    @IsOptional()
    @IsString()
    herramientas?: string;  

    @IsOptional()
    @IsString()
    consumibles?: string;

    @IsOptional()
    @IsInt()
    personalRequerido?: number;
}