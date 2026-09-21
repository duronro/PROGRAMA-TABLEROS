import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaquinasService } from './maquinas.service';
import { MaquinasController } from './maquinas.controller';
import { Maquina } from './entidades/maquinas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Maquina])],
  controllers: [MaquinasController],
  providers: [MaquinasService],
  exports: [MaquinasService], // por si otros módulos (cargas, mantenimientos) necesitan usar este service después
})
export class MaquinasModule {}