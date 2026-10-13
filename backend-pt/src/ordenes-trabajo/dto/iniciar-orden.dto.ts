// iniciar-orden.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class IniciarOrdenDto {
  @IsString()
  @IsNotEmpty()
  asignadoA: string;
}