import{ Controller, Post, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MantenimientosMaquinasService } from './mant.service';

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
}
