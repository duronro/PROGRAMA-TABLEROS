import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Maquina } from './entidades/maquinas.entity';
import { CrearMaquinaDto } from './dto/crearmaquina.dto';
import { ActualizarMaquinaDto } from './dto/actualizarmaq.dto';

@Injectable()
export class MaquinasService {
  constructor(
    @InjectRepository(Maquina)
    private readonly maquinaRepository: Repository<Maquina>,
  ) {}

  async crear(dto: CrearMaquinaDto): Promise<Maquina> {
    const maquina = this.maquinaRepository.create(dto);
    return this.maquinaRepository.save(maquina);
  }

  async listarTodas(): Promise<Maquina[]> {
    return this.maquinaRepository.find();
  }

  async buscarPorId(id: number): Promise<Maquina> {
    const maquina = await this.maquinaRepository.findOneBy({ id });
    if (!maquina) {
      throw new NotFoundException(`Máquina con id ${id} no encontrada`);
    }
    return maquina;
  }

  async actualizar(id: number, dto: ActualizarMaquinaDto): Promise<Maquina> {
    const maquina = await this.buscarPorId(id);
    Object.assign(maquina, dto);
    return this.maquinaRepository.save(maquina);
  }
}