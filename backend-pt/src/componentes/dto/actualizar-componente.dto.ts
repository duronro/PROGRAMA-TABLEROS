import {PartialType} from '@nestjs/mapped-types';
import {CrearCompDto} from './crearcomp.dto';

export class ActualizarCompDto extends PartialType(CrearCompDto) {}