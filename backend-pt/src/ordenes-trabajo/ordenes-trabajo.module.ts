// ordenes-trabajo.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenTrabajo } from './entidades/orden-trabajo.entity';
import { OrdenesTrabajoService } from './ordenes-trabajo.service';
import { OrdenesTrabajoController } from './ordenes-trabajo.controller';
import { MantenimientosModule } from '../mantenimientos/mant.module'; // ajusta al nombre real de tu archivo
import { MaquinasModule } from '../maquinas/maquinas.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenTrabajo]), MantenimientosModule, MaquinasModule],
  controllers: [OrdenesTrabajoController],
  providers: [OrdenesTrabajoService],
  exports: [OrdenesTrabajoService],
})
export class OrdenesTrabajoModule {}