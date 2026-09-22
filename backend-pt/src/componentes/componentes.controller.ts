import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ComponentesService } from './componentes.service';
import { CrearCompDto } from './dto/crearcomp.dto';
import { ActualizarCompDto } from './dto/actualizar-componente.dto';

@Controller('componentes')
export class ComponentesController {
  constructor(private readonly componentesService: ComponentesService) {}

  @Post()
  crear(@Body() dto: CrearCompDto) {
    return this.componentesService.crear(dto);
  }

  @Get()
  listarTodos() {
    return this.componentesService.listarTodos();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.componentesService.buscarPorId(id);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarCompDto,
  ) {
    return this.componentesService.actualizar(id, dto);
  }
}