// captura.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CargasService } from '../cargas/cargas.service';
import { CrearCargaDto } from '../cargas/dto/crearcarg.dto';
import { MantenimientosMaquinasService } from '../mantenimientos/mant.service';
import { OrdenesTrabajoService } from '../ordenes-trabajo/ordenes-trabajo.service';

@Controller('captura')
export class CapturaController {
  constructor(
    private readonly cargasService: CargasService,
    private readonly mantenimientosService: MantenimientosMaquinasService,
    private readonly ordenesService: OrdenesTrabajoService,
  ) {}

  @Post('carga')
  async capturarCarga(@Body() dto: CrearCargaDto) {
    const carga = await this.cargasService.crear(dto);
    const ordenesGeneradas = await this.ordenesService.generarParaMaquina(dto.maquinaId);
    const estado = await this.mantenimientosService.calcularEstado(dto.maquinaId);
    return { carga, ordenesGeneradas, estado };
  }
}