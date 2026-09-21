import {Controller, Get, Post, Patch, Body, Param, ParseIntPipe} from '@nestjs/common';
import {MaquinasService} from './maquinas.service';
import {CrearMaquinaDto} from './dto/crearmaquina.dto';
import {ActualizarMaquinaDto} from './dto/actualizarmaq.dto';

@Controller('maquinas')
export class MaquinasController {
    constructor(private readonly maquinasService: MaquinasService) {}

    @Post()
    crear(@Body() dto: CrearMaquinaDto) {
        return this.maquinasService.crear(dto);
    }

    @Get()
    listarTodas() {
        return this.maquinasService.listarTodas();
    }

    @Get(':id')
    buscarPorId(@Param('id', ParseIntPipe) id: number) {
        return this.maquinasService.buscarPorId(id);
    }

    @Patch(':id')
    actualizar(
        @Param('id', ParseIntPipe) id: number, 
        @Body() dto: ActualizarMaquinaDto) {
        return this.maquinasService.actualizar(id, dto);
    }
}