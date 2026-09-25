import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MantenimientosMaquinasService } from './mant.service';
import { MantenimientosMaquinasController } from './mant.controller';
import { MantenimientoMaquina } from './entidades/mant-maquina.entity';
import { MaquinasModule } from '../maquinas/maquinas.module';
import { ComponentesModule } from '../componentes/componentes.module';
import { CargasModule } from '../cargas/cargas.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([MantenimientoMaquina]),
        MaquinasModule,
        ComponentesModule,
        CargasModule,
    ],
    providers: [MantenimientosMaquinasService],
    controllers: [MantenimientosMaquinasController],
    exports: [MantenimientosMaquinasService],
})

export class MantenimientosModule {}