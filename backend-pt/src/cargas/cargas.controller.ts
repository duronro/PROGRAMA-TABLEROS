import { Controller,Post,Get,Body,Param,Query,ParseIntPipe, } from '@nestjs/common';
import { CargasService } from './cargas.service';
import { CrearCargaDto } from './dto/crearcarg.dto';

@Controller('cargas')
export class CargasController {
  constructor(private readonly cargasService: CargasService) {}

  @Post()
  crear(@Body() dto: CrearCargaDto) {
    return this.cargasService.crear(dto);
  }

  @Get('maquina/:maquinaId')
  listarPorMaquina(
    @Param('maquinaId', ParseIntPipe) maquinaId: number,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.cargasService.listarPorMaquina(maquinaId, desde, hasta);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.cargasService.buscarPorId(id);
  }
}