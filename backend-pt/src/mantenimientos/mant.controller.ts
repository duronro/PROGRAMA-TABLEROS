import{ Controller, Post, Get, Param, ParseIntPipe, Body } from '@nestjs/common';
import { MantenimientosMaquinasService } from './mant.service';
import { RegistrarMantenimientoDto } from './dto/crearmant.dto';

@Controller('mantenimientos-maquina')
export class MantenimientosMaquinasController {
    constructor(private readonly service: MantenimientosMaquinasService){}

    @Post('inicializar')
    inicializar(){
        return this.service.inicializar();
    }

    @Get('maquina/:maquinaId')
    listarPorMaquina(@Param('maquinaId', ParseIntPipe) maquinaId: number){
        return this.service.listarPorMaquina(maquinaId);
    }

    @Get('estado/:maquinaId')
    calcularEstado(@Param('maquinaId', ParseIntPipe) maquinaId: number){
        return this.service.calcularEstado(maquinaId);
    }

    @Post('registrar')
    registrar(@Body() dto: RegistrarMantenimientoDto) {
        return this.service.registrar(dto);
    }

    @Get('historial/:maquinaId')
    historial(@Param('maquinaId', ParseIntPipe) maquinaId: number) {
        return this.service.historialPorMaquina(maquinaId);
    }
}
