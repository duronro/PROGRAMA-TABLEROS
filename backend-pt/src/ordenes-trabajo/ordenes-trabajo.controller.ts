// ordenes-trabajo.controller.ts
import {
  Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe, ParseEnumPipe,
} from '@nestjs/common';
import { OrdenesTrabajoService } from './ordenes-trabajo.service';
import { EstadoOrden } from './entidades/orden-trabajo.entity';
import { IniciarOrdenDto } from './dto/iniciar-orden.dto';
import { ActualizarChecklistDto } from './dto/actualizar-checklist.dto';
import { CompletarOrdenDto } from './dto/completar-orden.dto';

@Controller('ordenes-trabajo')
export class OrdenesTrabajoController {
  constructor(private readonly service: OrdenesTrabajoService) {}

  @Get()
  listar(@Query('estado', new ParseEnumPipe(EstadoOrden, { optional: true })) estado?: EstadoOrden) {
    return this.service.listarPorEstado(estado);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscarPorId(id);
  }

  @Post('generar/:maquinaId') // disparo manual, útil para pruebas
  generar(@Param('maquinaId', ParseIntPipe) maquinaId: number) {
    return this.service.generarParaMaquina(maquinaId);
  }

  @Patch(':id/iniciar')
  iniciar(@Param('id', ParseIntPipe) id: number, @Body() dto: IniciarOrdenDto) {
    return this.service.iniciar(id, dto);
  }

  @Patch(':id/checklist')
  checklist(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarChecklistDto) {
    return this.service.actualizarChecklist(id, dto);
  }

  @Patch(':id/completar')
  completar(@Param('id', ParseIntPipe) id: number, @Body() dto: CompletarOrdenDto) {
    return this.service.completar(id, dto);
  }
}