import {IsString, IsNotEmpty,} from 'class-validator';

export class CrearMaquinaDto{
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    codigo: string;
}