import {PartialType} from '@nestjs/mapped-types';
import {CrearMaquinaDto} from './crearmaquina.dto';

export class ActualizarMaquinaDto extends PartialType(CrearMaquinaDto) {}
