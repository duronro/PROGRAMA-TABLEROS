// captura.module.ts
import { Module } from '@nestjs/common';
import { CapturaController } from './captura.controller';
import { CargasModule } from '../cargas/cargas.module';
import { MantenimientosModule } from '../mantenimientos/mant.module'; // ajusta la ruta
import { OrdenesTrabajoModule } from '../ordenes-trabajo/ordenes-trabajo.module';

@Module({
  imports: [CargasModule, MantenimientosModule, OrdenesTrabajoModule],
  controllers: [CapturaController],
})
export class CapturaModule {}